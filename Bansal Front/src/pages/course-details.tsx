import { useEffect, useState } from "react";
import CouponModal from "../components/CouponModal";
import Slider from "react-slick";
import ResponsiveMover from "../components/ResponsiveMover";
import { useNavigate, useParams } from "react-router-dom";
import LoaderWithBackground from "../components/LoaderWithBackground";
import { postApi } from "../services/services";
import { APIPATH, IMAGE_URL, RAZOR_API_KEY } from "../api/urls";
import { useAuthStore } from "../store/auth/authStore";
import { useModal } from "../components/ModalContext";
import { toast } from "react-toastify";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";

const CourseDetails = () => {
  const { token, logout, isLogin, userDetails } = useAuthStore();
  const [courseData, setCourseData] = useState<any>("");
  const [teacherDetails, setTeacherDetails] = useState<any>("");
  const [inputCoupon, setInputCoupon] = useState("");
  const [couponList, setCouponList] = useState([]);
  const [isCouponActive, setIsCouponActive] = useState(false);
  // const [courseAll, setCourseAll] = useState<any>("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const slug = id;
  const navigate = useNavigate();
  const { Razorpay } = useRazorpay();
  const { openLogin } = useModal();
  useEffect(() => {
    getCourseData();
    isLogin && getCouponList();
  }, []);
  const getCourseData = () => {
    setLoading(true);
    postApi(APIPATH.courseDetails, { slug: slug }, token, logout)
      .then((resp) => {
        console.log(resp, "desfaef");
        const { success, data, message, teachers } = resp;
        if (success) {
          // setCourseAll(resp);
          setCourseData(data);
          setTeacherDetails(teachers);
          // setTeacher(teacher);
        } else {
          console.log(message);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };
  const getCouponList = () => {
    setLoading(true);
    postApi(
      APIPATH.couponList,
      { user_id: userDetails?.id, type: "course" },
      token,
      logout
    )
      .then((resp) => {
        console.log(resp, "coupen");
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
      coupon_for: "course",
      coupon_code: coupon_code,
      course_id: courseData?.id,
    };
    postApi(APIPATH.applyCouponApi, body, token, logout)
      .then((resp) => {
        const { status, msg } = resp;
        if (status) {
          const {
            real_amount,
            discount_amount,
            gst_amount,
            total_amount,
            message,
          } = resp;
          setCourseData((prevData: any) => ({
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
          toast.error(msg);
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
      coupon_for: "course",
      coupon_code: inputCoupon,
      course_id: courseData?.id,
      remove: 1, // Mark coupon for removal
    };

    postApi(APIPATH.applyCouponApi, body, token, logout)
      .then((resp) => {
        const { status, message } = resp;
        if (status) {
          setCourseData((prevData: any) => ({
            ...prevData,
            offer_price: courseData?.price,
            discount_amount: 0,
            gst_amount: 0,
            total_amount: courseData?.price,
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
       if (courseData?.total_amount === 0) {
      // Directly enroll the user if the course is free
      buyCourse("free-course-transaction"); // Pass a dummy transaction ID or any logic you prefer for free courses
      return; // Exit the function since no payment is needed for free courses
    }
    setLoading(true);
    const body = {
      order_type: "course",
      course_id: courseData?.id,
      transaction_id: transaction_id,
      payment_type: "online",
      payment_status: "complete",
      coupon_code: inputCoupon,
    };

    postApi(APIPATH.buyCourse, body, token, logout)
      .then((resp) => {
        const { success, message } = resp;
        if (success == true) {
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
      amount: courseData?.total_amount,
      currency: "INR",
      name: "Course",
      description: courseData?.course_name,
      order_id: order_id, // Generate order_id on server
      handler: (response) => {
        console.log(response);
        buyCourse(response?.razorpay_payment_id);
      },
      prefill: {
        name: userDetails?.name,
        email: userDetails?.email,
        contact: userDetails?.mobile,
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
    setLoading(true);
    postApi(
      APIPATH.createRazorPay,
      { amount: courseData?.total_amount },
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

  const settings = {
    dots: false,
    arrows: false,
    infinite: teacherDetails.length > 1,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1920,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <>
      <LoaderWithBackground visible={loading} />
      <ResponsiveMover />
      <div className="course-details-page">
        <div className="container">
          <div className="row justify-content-between">
            {/* <div className="col-lg-7 col-xxl-6 mb-4"> */}
            <div className="col-lg-7 col-xxl-8 mb-4">
              <div className="course-details-left-section">
                <div className="row justify-content-between">
                  <div className="col-lg-12 col-md-6 mb-0 mb-md-4 mb-lg-0">
                    <div className="details-top-badge">
                      <span className="corse-mode-badge">
                        <i className="fa-solid fa-video" />{" "}
                        {courseData.batch_type}
                      </span>
                      <span className="corse-cate-badge">
                        Category:&nbsp;
                        {courseData?.category_name || "no category"}{" "}
                      </span>
                    </div>
                    <h1 className="course-detail-heading">
                      {courseData?.course_name}
                    </h1>
                    <div className="course-subjects-tag">
                      {" "}
                      <span className="course-subjects-tag-icon">
                        <i className="fa-solid fa-book" />
                      </span>
                      {courseData?.subject_names}
                    </div>
                    <div className="course-fee-move"></div>
                    <div className="buy-btns-details-move"></div>
                  </div>
                  <div className="col-lg-12 col-md-6 mx-auto mb-0 mb-md-4 mb-lg-0">
                    <div className="mob-details-move"></div>
                  </div>
                </div>
                <ul className="course-details-tags">
                  <li>
                    <a className="course-details-tag-link active" href="#About">
                      About
                    </a>
                  </li>
                  <li>
                    <a className="course-details-tag-link" href="#Details">
                      Details
                    </a>
                  </li>
                  <li>
                    <a className="course-details-tag-link" href="#Teachers">
                      Teachers
                    </a>
                  </li>
                  {/* <li>
                                        <a className="course-details-tag-link" href="#FAQ’S">FAQ’S</a>
                                    </li> */}
                </ul>
                <div className="course-details-about" id="About">
                  <h2 className="sub-heading">This Course Includes:</h2>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <div className="cd-include-card">
                        <h3 className="cd-include-heading">Education Level</h3>
                        <p className="cd-include-text">
                          {courseData?.class_name}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="cd-include-card">
                        <h3 className="cd-include-heading">Duration</h3>
                        <p className="cd-include-text">
                          {courseData?.duration} Month
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="cd-include-card">
                        <h3 className="cd-include-heading">Subject Covered</h3>
                        <p className="cd-include-text">
                          {courseData?.subject_count}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {teacherDetails && (
                  <div className="course-details-content-card" id="Teachers">
                    <h2 className="sub-heading">Know Your Teachers</h2>
                    <div className="teachers-slider">
                      <Slider {...settings}>
                        {teacherDetails &&
                          teacherDetails.map((teacher: any) => (
                            <div key={teacher.id} className="item">
                              <div className="teachers-team-card">
                                <img
                                  src={`${IMAGE_URL}${teacher?.image}`}
                                  alt={teacher?.name}
                                  className="img-fluid"
                                />
                                <h4 className="tname-text">{teacher?.name}</h4>
                                <div className="teacher-profile">
                                  <p className="tpost-text mb-0">
                                    {teacher?.subject}
                                  </p>
                                  <p className="texp-text mb-0">
                                    {teacher?.experience}+ years
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </Slider>
                    </div>
                  </div>
                )}

                <div className="course-details-content-card" id="Details">
                  <h2 className="sub-heading">Know More Details </h2>
                  <ul className="course-details-context-listing">
                    <li>Video&nbsp;: {courseData?.video_count}+</li>
                    <li>PDF&nbsp;: {courseData?.pdf_count}+</li>
                    {/* <li>Audio&nbsp;: {courseData?.audio_count}+</li>
                                        <li>Notes: {courseData?.notes_count}+</li> */}
                    {/* <li>Morem ipsum dolor sit amet, consectetur </li> */}
                  </ul>
                  <p
                    className="course-details-context"
                    dangerouslySetInnerHTML={{
                      __html: courseData?.description,
                    }}
                  ></p>
                </div>
              </div>
            </div>
            <div className="col-md-8 col-lg-5 col-xxl-4 mb-4">
              <div className="course-card-mover">
                <div className="course-details-right-card">
                  <div className="course-img-slide">
                    <div
                      id="myCarousel"
                      className="carousel slide"
                      data-bs-ride="carousel"
                      data-bs-touch="true"
                    >
                      <div className="carousel-inner">
                        <div className="carousel-item active">
                          <img
                            src={`${IMAGE_URL}${courseData?.details_image}`}
                            className="d-block w-100"
                            alt={courseData.course_name}
                          />
                        </div>
                        {/* <div className="carousel-item">
                                                    <img src="/assets/img/listing.png" className="d-block w-100" alt="..." />
                                                </div>
                                                <div className="carousel-item">
                                                    <img src="/assets/img/listing.png" className="d-block w-100" alt="..." />
                                                </div> */}
                      </div>
                      {/* <div className="carousel-indicators">
                                                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to={0} className="active" aria-current="true" aria-label="Slide 1" />
                                                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to={1} aria-label="Slide 2" />
                                                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to={2} aria-label="Slide 3" />
                                            </div> */}
                    </div>
                  </div>
                  <div className="course-fee-mover">
                    <p className="course-price details-page-price">
                      {/* <span className="course-price-heading">Course&nbsp;Fee</span> */}
                      <span className="mrp-price">₹ {courseData?.price}</span>
                      {/* <span className="discount-price">{courseData.discount}{courseData?.discount_type =='percentage' ? `% `: `₹`}</span> */}
                      ₹ {courseData.offer_price}
                    </p>
                  </div>
                  <div className="course-cart-detail-card">
                    <h4>Payment Details</h4>
                    <table>
                      <tbody>
                        <tr>
                          <td className="text">Price</td>
                          <td className="text-end">
                            ₹ {courseData?.offer_price}
                          </td>
                        </tr>
                        <tr>
                          <td className="text">Discount</td>
                          <td className="text-primery text-end">
                            - ₹ {courseData?.discount_amount}
                          </td>
                        </tr>
                        <tr>
                          <td className="text">GST Amount</td>
                          <td className="text-end">
                            ₹ {courseData?.gst_amount}
                          </td>
                        </tr>
                        <tr>
                          <th className="text">Total Payable Amount</th>
                          <th className="text-end">
                            ₹ {courseData?.total_amount}
                          </th>
                        </tr>
                      </tbody>
                    </table>
                    <div className="buy-btns-details-mover">
                      <div className="cart-action-btn">
                        <a onClick={createOrder} className="pay-now-btn btn">
                          Pay Now ₹ {courseData?.total_amount}
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
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          View Coupon Code{" "}
                          <i className="fa-solid fa-angle-right" />
                        </button>
                      </div>
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

      <CouponModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onApply={handleApplyCoupon}
        coupons={couponList}
        loading={loading}
      />
      {/* Modal */}
      {/* <div className="modal fade apply-copn-modal" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog  modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Select Coupon</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="my-coupns-modal">
                                <div className="d-flex gap-1 mb-3">
                                    <input type="text" className="form-control" onkeyup="handleSelection(this)" id="search" placeholder="Enter Coupon Code" aria-label="Enter Coupon Code" aria-describedby="basic-addon2" />
                                    <button type="button" className="btn btn-aply-cpn-modal">Apply</button>
                                </div>
                                <div className="select-coupen-check mb-4">
                                    <div className="select-cpn-crad">
                                        <div className="mb-4">
                                            <input type="radio" className="btn-check couponDiscount" onclick="couponDiscount('IV200')" name="options-outlined" id="first-code-outlined" autoComplete="off" defaultChecked />
                                            <label className="btn aply-btn-cpn-code" htmlFor="first-code-outlined">
                                                <p className="cpncode-title">Flat 200 INR Discount</p>
                                                <p className="cpncode mb-0">Coupon Code : <span className="code-cpn">IV200</span></p>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="select-cpn-crad">
                                        <div className="mb-4">
                                            <input type="radio" onclick="couponDiscount('IV100')" className="btn-check couponDiscount" name="options-outlined" id="second-code-outlined" autoComplete="off" />
                                            <label className="btn aply-btn-cpn-code" htmlFor="second-code-outlined">
                                                <p className="cpncode-title">Flat 100 INR Discount</p>
                                                <p className="cpncode mb-0">Coupon Code : <span className="code-cpn">IV100</span></p>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="select-cpn-crad">
                                        <div className="mb-4">
                                            <input type="radio" onclick="couponDiscount('IV300')" className="btn-check couponDiscount" name="options-outlined" id="third-code-outlined" autoComplete="off" />
                                            <label className="btn aply-btn-cpn-code" htmlFor="third-code-outlined">
                                                <p className="cpncode-title">Flat 300 INR Discount</p>
                                                <p className="cpncode mb-0">Coupon Code : <span className="code-cpn">IV300</span></p>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
    </>
  );
};

export default CourseDetails;
