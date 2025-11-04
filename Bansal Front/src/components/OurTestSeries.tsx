import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";


const CourseSettings = {
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1920,
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
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};
const OurTestSeries = ({ coursesFilter }: any) => {
  // Filter only categories that have at least one course
  const validCategories = coursesFilter.filter(
    (category: any) => category.test_series && category.test_series.length > 0
  );

  const [activeTab, setActiveTab] = useState<string>("");

  // Set default category on first load
  useEffect(() => {
    if (validCategories.length > 0) {
      setActiveTab(validCategories[0].category_name);
    }
  }, [coursesFilter]);

  const activeCategory = validCategories.find(
    (category: any) => category.category_name === activeTab
  );

  if (validCategories.length === 0) {
    return <div className="text-center py-5">No courses available.</div>;
  }

  return (
    <section className="overflow-hidden">
      <div className="course-listing-section bg-white">
        <div className="container">
          <h2 className="heading mb-4">
            Explore All Our <span className="course-heading-span">Test Series</span>
          </h2>

          {/* Tabs */}
          <ul className="courses-tabs mb-0">
            {validCategories.map((category: any) => (
              <li className="nav-item" role="presentation" key={category.id}>
                <button
                  className={`nav-link ${activeTab === category.category_name ? "active" : ""
                    }`}
                  type="button"
                  onClick={() => setActiveTab(category.category_name)}
                >
                  {category.category_name}
                </button>
              </li>
            ))}
          </ul>

          {/* Course Slider */}
          <div className="courses-listing" data-aos="fade-left">
            {activeCategory && (
              <div className="course-listing-slider">
                <Slider {...CourseSettings}>
                  {activeCategory.test_series.map((course: any, index: number) => (
                    <div className="item" key={index}>
                      <div className="course-card">
                        <div className="course-card-top">
                          <div className="course-op-icon">
                            <i className="fa-solid fa-book" />
                          </div>
                          <div className="course-top-content">
                            <span className="course-badge">
                              <i className="fa-solid fa-video" /> {course?.batch_type}
                            </span>
                            <h3 className="course-heading">{course.name}</h3>
                            <p className="course-price">
                              ₹{course.offer_price}
                              <span className="mrp-price">₹{course.price}</span>
                              <span className="discount-price">{course.discount}%</span>
                              {/* <p className="course-special-listing text-xxl-end">
                                {course?.content.slice(0,100)}
                              </p> */}
                            </p>
                          </div>
                        </div>
                        <div className="course-card-bottom">
                          <Link to={`/test-series/${course.slug}`} className="btn course-action-btn-white">
                            View Details
                          </Link>
                          {/* <Link to="#" className="btn course-action-btn-prime">
                            Enroll now
                          </Link> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurTestSeries;