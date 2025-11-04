
import SelectSub from "./select-subject";
import { Link } from "react-router-dom";
import { useState } from "react";
interface Course {
    id: string;
  series_name: string;
  badge: string;
  orderId: string;
  enrolledDate: string;
  course_expired_date: string;
  expired_date:string;
  created_at: string;
  endDate: string;
  image?: string;
  purchase_date:string;
  subjects?: string[];
}

type MyCourseProps = {
  set: Course[];
};

const MyCourse: React.FC<MyCourseProps> = ({ set }) => {
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
          <h3 className="sub-heading text-dark mb-0">My Test Series</h3>
        </div>
        <ul className="my-courses-listing">
          {set && set.length > 0 ? (
            set.map((course, index) => (
              <li key={index}>
                <div className="my-course-card">
                  <div className="my-course-card-top">
                    <img
                      src={course.image || "/assets/img/listing.png"}
                      alt="#"
                      className="img-fluid"
                    />
                    <div className="my-course-card-content">
                      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                        <h2 className="my-course-name mb-3">{course.series_name}</h2>
                        <span className="my-course-badge mb-3">{course.badge}</span>
                      </div>
                      <div className="d-flex align-items-center gap-4 mb-3 flex-wrap">
                        <h2 className="my-course-orderid mb-0">
                          Order ID : #{course.id}
                        </h2>
                        {/* <Link to="#" className="my-course-invoice">
                          <i className="fa-solid fa-download" /> Download Invoice
                        </Link> */}
                      </div>
                      <p className="my-course-enroll">Enrolled : {course.purchase_date}</p>
                    </div>
                  </div>
                  
                  <div className="my-course-bottom">
                    <p>End Date : {course.expired_date}</p>
                    <Link to={`/dashboard/exams/course/${course.id}`} className="btn secondary-btn">
  Test List
</Link>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p>No courses found</p>
          )}
        </ul>
      </div>
    </>
  );
};

export default MyCourse;
