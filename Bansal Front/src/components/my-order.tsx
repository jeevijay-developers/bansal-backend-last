const MyOrder = () => {
  return (
    <>
      <div>
        <div className="mb-3 d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <h3 className="sub-heading text-dark mb-0">My Order</h3>
        </div>
        <ul className="my-courses-listing">
          <li>
            <div className="my-course-card">
              <div className="my-course-card-top">
                <img
                  src="/assets/img/book.png"
                  alt="#"
                  className="img-fluid my-order-image"
                />
                <div className="my-course-card-content">
                  <h2 className="my-course-name mb-3">
                    Crack NEET 2025 with Bansal AITS 180 – Your Ultimate Mock
                    Test Series for Crack NEET 2025 with Bansal AITS 180 – Your
                    Ultimate Mock Test Series for
                  </h2>
                  <div className="d-flex align-items-center gap-4 mb-3 flex-wrap">
                    <h2 className="my-course-orderid mb-0">Order ID : 01200</h2>
                    {/* <a href="#" className="my-course-invoice">
                      <i className="fa-solid fa-download" /> Download Invoice
                    </a> */}
                  </div>
                  <p className="my-course-enroll">
                    Order : 12-nov-2025, 12:50 PM
                  </p>
                </div>
              </div>
              <div className="my-course-bottom my-order-bottom">
                <div>
                  <p className="mb-2">
                    Tracking By :{" "}
                    <span className="text-lighter"> Ship Rocket </span>
                  </p>
                  <p>
                    Tracking Number :{" "}
                    <span className="text-lighter"> 01200100100 </span>
                  </p>
                </div>
                <a href="#" className="btn secondary-btn">
                  Track Order
                </a>
              </div>
            </div>
          </li>
          <li>
            <div className="my-course-card">
              <div className="my-course-card-top">
                <img
                  src="/assets/img/book.png"
                  alt="#"
                  className="img-fluid my-order-image"
                />
                <div className="my-course-card-content">
                  <h2 className="my-course-name mb-3">
                    Crack NEET 2025 with Bansal AITS 180 – Your Ultimate Mock
                    Test Series for Crack NEET 2025 with Bansal AITS 180 – Your
                    Ultimate Mock Test Series for
                  </h2>
                  <div className="d-flex align-items-center gap-4 mb-3 flex-wrap">
                    <h2 className="my-course-orderid mb-0">Order ID : 01200</h2>
                    <a href="#" className="my-course-invoice">
                      <i className="fa-solid fa-download" /> Download Invoice
                    </a>
                  </div>
                  <p className="my-course-enroll">
                    Order : 12-nov-2025, 12:50 PM
                  </p>
                </div>
              </div>
              <div className="my-course-bottom my-order-bottom">
                <div>
                  <p className="mb-2">
                    Tracking By :{" "}
                    <span className="text-lighter"> Ship Rocket </span>
                  </p>
                  <p>
                    Tracking Number :{" "}
                    <span className="text-lighter"> 01200100100 </span>
                  </p>
                </div>
                <a href="#" className="btn secondary-btn">
                  Track Order
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default MyOrder;
