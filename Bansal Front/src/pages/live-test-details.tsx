import { useEffect, useState } from "react";

import CouponModal from "../components/CouponModal";

import ResponsiveMover from "../components/ResponsiveMover";
import { useNavigate, useParams } from "react-router-dom";
import { postApi } from "../services/services";
import { APIPATH, IMAGE_URL, RAZOR_API_KEY } from "../api/urls";
import { toast } from "react-toastify";
import LoaderWithBackground from "../components/LoaderWithBackground";
import { useAuthStore } from "../store/auth/authStore";
import { useModal } from "../components/ModalContext";
import { RazorpayOrderOptions, useRazorpay } from "react-razorpay";

const TestSeriesDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testSeriesData, setTestSeriesData] = useState<any>("");
  const { token, logout, isLogin, userDetails } = useAuthStore();
  const [couponList, setCouponList] = useState([]);
  const [inputCoupon, setInputCoupon] = useState("");
  const [isCouponActive, setIsCouponActive] = useState(false);
  const { Razorpay } = useRazorpay();
  const { openLogin } = useModal();
  const navigate = useNavigate();

    const { id } = useParams();
    const decodedId = atob(id || "");
  useEffect(() => {
    getTestSeriesDetails();
  }, []);

  //   const handleViewDetails = async (slug: string) => {
  //   await getTestSeriesDetails(slug); // Optional: fetch before navigating
  //   navigate(`/test-series/${slug}`);
  // };

  const getTestSeriesDetails = async () => {
    setLoading(true);
    try {
      const resp = await postApi(
        APIPATH.liveTestDetails,
        { test_id: decodedId },
        token,
        logout
      );
   
      setTestSeriesData(resp.data);

    } catch (error: any) {
      console.error("Error fetching test series:", error);
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  const getCouponList = () => {
    setLoading(true);
    postApi(
      APIPATH.couponList,
      { user_id: userDetails?.id, type: "live-test" },
      token,
      logout
    )
      .then((resp) => {
        // console.log(resp, 'coupen')
        const { success, data } = resp;
        if (success) {
          setCouponList(data);
        } else {
          toast.error(data);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };
  const handleApplyCoupon = (coupon_code: any) => {
    if (!coupon_code) {
      toast.error("Please select coupon code!");
      return false;
    }
    setLoading(true);
    setInputCoupon(coupon_code);
    const body = {
      coupon_for: "live-test",
      coupon_code: coupon_code,
      course_id: testSeriesData?.id,
    };
    postApi(APIPATH.applyCouponApi, body, token, logout)
      .then((resp) => {
        const { status, message } = resp;
        if (status) {
          const {
            real_amount,
            discount_amount,
            gst_amount,
            total_amount,
            message,
          } = resp;
          setTestSeriesData((prevData: any) => ({
            ...prevData,
            offer_price: real_amount,
            discount_amount: discount_amount,
            gst_amount: gst_amount,
            total_amount: total_amount,
          }));
          setShowModal(false);
          toast.success(message);
          setIsCouponActive(false);
        } else {
          toast.error(message);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };
  const handleRemoveCoupon = () => {
    if (!inputCoupon) {
      toast.error("No coupon to remove!");
      return;
    }

    setLoading(true);

    const body = {
      coupon_for: "test",
      coupon_code: inputCoupon,
      course_id: testSeriesData?.id,
      remove: 1, // Mark coupon for removal
    };

    postApi(APIPATH.applyCouponApi, body, token, logout)
      .then((resp) => {
        const { status, message } = resp;
        if (status) {
          setTestSeriesData((prevData: any) => ({
            ...prevData,
            offer_price: testSeriesData?.price,
            discount_amount: 0,
            gst_amount: 0,
            total_amount: testSeriesData?.price,
          }));
          toast.success("Coupon removed successfully");
          setInputCoupon("");
          setIsCouponActive(true); // optionally allow user to apply again
        } else {
          toast.error(message || "Failed to remove coupon");
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  };
  const buyCourse = (transaction_id: any) => {
    if (!isLogin) {
      //   navigate("/");
      openLogin();
      return false;
    }
    setLoading(true);
    const body = {
      order_type: "live-test",
      test_id: testSeriesData?.id,
      transaction_id: transaction_id,
      payment_type: "online",
      payment_status: "pending",
      coupon_code: inputCoupon,
    };

    postApi(APIPATH.buyLiveTest, body, token, logout)
      .then((resp) => {
        const { success, message } = resp;
        if (success) {
          navigate("/dashboard");
        } else {
          toast.error(message);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };
  const handlePayment = (order_id: any) => {
    const options: RazorpayOrderOptions = {
      key: RAZOR_API_KEY,
      amount: testSeriesData?.total_amount,
      currency: "INR",
      name: "Live Test",
      description: testSeriesData?.name,
      order_id: order_id, // Generate order_id on server
      handler: (response) => {
        console.log(response);
        buyCourse(response?.razorpay_payment_id);
      },
      prefill: {
        name: userDetails?.name,
        email: userDetails?.email,
        contact: userDetails?.mobileNumber,
      },
      theme: {
        color: "#ff693d",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };
  const createOrder = () => {
    if (!isLogin) {
      openLogin();
      return false;
    }
     if (testSeriesData?.total_amount === 0) {
      // Directly enroll the user if the course is free
      buyCourse("free-course-transaction"); // Pass a dummy transaction ID or any logic you prefer for free courses
      return; // Exit the function since no payment is needed for free courses
    }


    setLoading(true);
    postApi(
      APIPATH.createRazorPay,
      { amount: testSeriesData?.total_amount },
      token,
      logout
    )
      .then((resp) => {
        const { success, message, order } = resp;
        if (success) {
          handlePayment(order?.id);
        } else {
          toast.error(message);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };
  // const handleApplyCoupon = (code: string) => {
  //     alert(`Coupon applied: ${code}`);
  //     setShowModal(false);
  // };
  return (
    <>
      <LoaderWithBackground visible={loading} />
      <ResponsiveMover />
      <div>
        <div className="course-details-page pb-0 testseries-details-page">
          <div className="container">
            <div className="row justify-content-between">
              {/* <div className="col-lg-7 col-xxl-6 mb-4"> */}
              <div className="col-lg-7 col-xxl-8 mb-4">
                <div className="course-details-left-section">
                  <div className="row">
                    <div className="col-lg-12 col-md-6 mb-4 mb-lg-0">
                      <div className="details-top-badge test-detail-badge">
                        <span className="corse-cate-badge">
                          Category:&nbsp;{testSeriesData?.category_name}{" "}
                        </span>
                      </div>
                      <h1 className="course-detail-heading testseries-details-heading">
                        <img
                          src={
                            testSeriesData?.image
                              ? `${IMAGE_URL}${testSeriesData?.details_image}`
                              : "/assets/img/no_image.jpg"
                          }
                          alt="#"
                          className="img-fluid"
                        />{" "}
                        {testSeriesData?.test_name}
                      </h1>
                      {/* <div className="course-details-about">
                                                <div className="row">
                                                    <div className="col-lg-4 mb-3">
                                                        <div className="cd-include-card">
                                                            <h3 className="cd-include-heading">Education Level</h3>
                                                            <p className="cd-include-text">8th Class</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 mb-3">
                                                        <div className="cd-include-card">
                                                            <h3 className="cd-include-heading">Duration</h3>
                                                            <p className="cd-include-text">3 Month</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 mb-3">
                                                        <div className="cd-include-card">
                                                            <h3 className="cd-include-heading">Subject Covered</h3>
                                                            <p className="cd-include-text">3 Subject</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                    </div>
                    <div className="col-lg-12 col-md-6 mb-4 mb-lg-0">
                      <div className="course-card-details-move"></div>
                    </div>
                  </div>
                  <div className="course-details-content-card" id="Details">
                    <h2 className="sub-heading">Know Details Test</h2>
                    {/* <ul className="course-details-context-listing">
                                            <li>Video&nbsp;: 200+</li>
                                            <li>PDF&nbsp;: 10+</li>
                                            <li>Audio&nbsp;: 30+</li>
                                            <li>Notes: 20+</li>
                                            <li>Morem ipsum dolor sit amet, consectetur </li>
                                        </ul> */}
                    <p
                      className="course-details-context"
                      dangerouslySetInnerHTML={{
                        __html: testSeriesData?.description,
                      }}
                    />
                  </div>
                  {/* <div className="faq-section p-0" id="FAQ’S">
                                        <div className="container">
                                            <h2 className="sub-heading">Frequently Asked Questions</h2>
                                            <div className="faq-card">
                                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                                    {faq.map((f, index) => {
                                                        const collapseId = `flush-collapse-${f.id || index}`;
                                                        const headingId = `flush-heading-${f.id || index}`;
                                                        return (
                                                            <div className="accordion-item" key={f.id || index}>
                                                                <h2 className="accordion-header" id={headingId}>
                                                                    <button
                                                                        className="accordion-button"
                                                                        type="button"
                                                                        data-bs-toggle="collapse"
                                                                        data-bs-target={`#${collapseId}`}
                                                                        aria-expanded="true"
                                                                        aria-controls={collapseId}>
                                                                        {f.question}
                                                                    </button>
                                                                </h2>
                                                                <div id={collapseId}
                                                                    className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`} aria-labelledby={headingId}
                                                                    data-bs-parent="#accordionFlushExample">
                                                                    <div className="accordion-body">
                                                                        <p className="text text-dark">{f.answer}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                </div>
              </div>
              <div className="col-lg-5 col-xxl-4 mb-4">
                <div className="course-card-details-movers">
                  <div className="course-details-right-card">
                    <p className="course-price details-page-price">
                      {/* <span className="course-price-heading">Fee</span> */}
                      <span className="mrp-price">
                        ₹ {testSeriesData?.price}
                      </span>
                      {/* <span className="discount-price"> {testSeriesData?.discount}{testSeriesData?.discount_type =='percentage' ? `% `: `₹`}</span> */}
                      ₹{testSeriesData?.offer_price}
                    </p>
                    <div className="course-cart-detail-card">
                      <h4>Payment Details</h4>
                      <table>
                        <tbody>
                          <tr>
                            <td className="text">Price</td>
                            <td className="text-end">
                              ₹ {testSeriesData?.offer_price}
                            </td>
                          </tr>
                          <tr>
                            <td className="text">Discount </td>
                            <td className="text-primery text-end">
                              - ₹ {testSeriesData?.discount_amount}
                            </td>
                          </tr>
                          <tr>
                            <td className="text">GST Amount</td>
                            <td className="text-end">
                              ₹ {testSeriesData?.gst_amount}
                            </td>
                          </tr>
                          <tr>
                            <th className="text">Total Payable Amount</th>
                            <th className="text-end">
                              ₹ {testSeriesData?.total_amount}
                            </th>
                          </tr>
                        </tbody>
                      </table>
                      <div className="cart-action-btn">
                        <a
                          onClick={createOrder}
                          href="#"
                          className="pay-now-btn btn"
                        >
                          Pay Now ₹ {testSeriesData?.total_amount}
                        </a>
                      </div>
                      <div className="apply-coupon-card-input">
                        <div className="apply-coupon-inputs-align">
                          <img
                            src="/assets/img/discount.svg"
                            alt="Discount Icon"
                            className="img-fluid"
                          />
                          <input
                            value={inputCoupon}
                            type="text"
                            placeholder="Enter Coupon Code"
                            className="form-control"
                            onChange={(e) => setInputCoupon(e.target.value)}
                            disabled={!isCouponActive}
                          />
                          {inputCoupon && !isCouponActive ? (
                            <button
                              type="button"
                              className="remove-coupon-btn"
                              onClick={handleRemoveCoupon}
                            >
                              <i className="fa fa-times" />{" "}
                              {/* FontAwesome Remove Icon */}
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="apply-coupon-btn"
                              onClick={() => handleApplyCoupon(inputCoupon)}
                            >
                              Apply
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            if (isLogin) {
                              getCouponList();
                              setShowModal(true);
                            } else {
                              openLogin();
                            }
                          }}
                          className="prdt-modal-open"
                          type="button"
                        >
                          View Coupon Code{" "}
                          <i className="fa-solid fa-angle-right" />
                        </button>
                      </div>
                      <div className="course-right-footer-sec d-none d-lg-block">
                        <div className="pay-throw-images">
                          <img
                            src="/assets/img/Visa.png"
                            alt="#"
                            className="trans-img"
                          />
                          <img
                            src="/assets/img/Mastercard.png"
                            alt="#"
                            className="trans-img"
                          />
                          <img
                            src="/assets/img/PayPal.png"
                            alt="#"
                            className="trans-img"
                          />
                          <img
                            src="/assets/img/GooglePay.png"
                            alt="#"
                            className="trans-img"
                          />
                          <img
                            src="/assets/img/GooglePay-1.png"
                            alt="#"
                            className="trans-img"
                          />
                        </div>
                        <div className="note-cart-items">
                          <p className="text-center">
                            Safe and secure payment | 100% Authentic resources
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             
            </div>
          </div>
        </div>
        {/* Modal */}
        <CouponModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onApply={handleApplyCoupon}
          coupons={couponList}
          loading={loading}
        />
      </div>
      {/* <TestSeries /> */}

    
    </>
  );
};

export default TestSeriesDetails;
