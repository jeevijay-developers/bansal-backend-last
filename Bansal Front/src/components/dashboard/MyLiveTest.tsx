
import SelectSub from "../select-subject";
import { Link } from "react-router-dom";
import { useState } from "react";
interface Test {
    id: string;
  test_name: string;
  badge: string;
    test_id: string;
      order_id: string;
  orderId: string;
  enrolledDate: string;
  test_expired_date: string;
  expired_date:string;
  created_at: string;
  endDate: string;
  image?: string;
  purchase_date:string;
start_time:string;
end_time:string;
  is_open?: boolean;
  is_attempted?: boolean;
  is_completed?: boolean;
}

type MyTestProps = {
  set: Test[];
};

const MyLiveTest: React.FC<MyTestProps> = ({ set }) => {
  const [modalOpen, setModalOpen] = useState(false);

  // You can customize subjects dynamically or keep as is
  const subjects = ["MATHEMATICS", "SCIENCE", "SOCIAL SCIENCE"];

  return (
    <>
      <SelectSub
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        subjects={subjects}
      />
      <div>
        <div className="mb-3 d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <h3 className="sub-heading text-dark mb-0">My Live Test</h3>
        </div>
        <ul className="my-courses-listing">
          {set && set.length > 0 ? (
            set.map((test, index) => (
              <li key={index}>
                <div className="my-course-card">
                  <div className="my-course-card-top">
                    <img
                      src={test.image || "/assets/img/listing.png"}
                      alt="#"
                      className="img-fluid"
                    />
                    <div className="my-course-card-content">
                      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                        <h2 className="my-course-name mb-3">{test.test_name}</h2>
                        <span className="my-course-badge mb-3">{test.badge}</span>
                      </div>
                      <div className="d-flex align-items-center gap-4 mb-3 flex-wrap">
                        <h2 className="my-course-orderid mb-0">
                          Order ID : #{test.order_id}
                        </h2>
                        {/* <Link to="#" className="my-course-invoice">
                          <i className="fa-solid fa-download" /> Download Invoice
                        </Link> */}
                      </div>
                      <p className="my-course-enroll">Enrolled at : {test.purchase_date}</p>
                      <p className="my-course-enroll">Expired Date : {test.expired_date}</p>
                    </div>
                  </div>
                  
                  <div className="my-course-bottom">
                    <p>Test Time : {test.start_time} to {test.end_time} </p>
                  
                   
                          <>

                          <Link
                                to={`/dashboard/exam-intro/${btoa(String(test.test_id))}`}
                                className="btn secondary-btn green-start-btn"
                              >
                                Start Now
                              </Link>
                            {/* {test.is_open && !test.is_attempted && (
                              <Link
                                to={`/dashboard/exam-intro/${btoa(String(test.id))}`}
                                className="btn secondary-btn green-start-btn"
                              >
                                Start Now
                              </Link>
                            )}

                            {test.is_attempted && (
                              <button className="btn btn-secondary" disabled>
                                Attempted
                              </button>
                            )}

                            {!test.is_open && !test.is_completed && (
                              <button className="btn btn-warning" disabled>
                                Not Started
                              </button>
                            )}

                            {test.is_completed && !test.is_attempted && (
                              <button className="btn btn-danger" disabled>
                                Expired
                              </button>
                            )}

                            {test.is_completed && test.is_attempted && (
                              <Link
                                to={`/test/result/${btoa(String(test.id))}`}
                                className="btn btn-primary"
                              >
                                View Result
                              </Link>
                            )} */}
                          </>
                       
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p>No Live Test found</p>
          )}
        </ul>
      </div>
    </>
  );
};

export default MyLiveTest;
