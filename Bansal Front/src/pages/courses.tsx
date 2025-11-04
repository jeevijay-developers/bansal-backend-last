import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import ListingFilter from '../components/listing-filter';
import { useEffect } from "react";
import AOS from 'aos';
import { postApi } from '../services/services';
import { APIPATH, IMAGE_URL } from '../api/urls';
import { useAuthStore } from '../store/auth/authStore';
export interface Course {
  id: number;
  course_name: string;
  title_heading: string;
  slug: string;
  course_type: string;
  mode_of_class: string;
  price: number;
  discount: number;
  offer_price: number;
  image: string;
}

export interface CourseCategory {
  id: number;
  category_name: string;
  image: string;
  slug: string;
  is_active: number;
  courses: Course[];
}

const CourseListingPage: React.FC = () => {
  // const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState<CourseCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { token, logout } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    AOS.init();

    // postApi(APIPATH.getCategory, {}, token, logout)
    //   .then((resp) => {
    //     const { success, data } = resp;
    //     if (success) {
    //       const nonEmptyCategories = data.filter(
    //         (cat: any) => cat.courses && cat.courses.length > 0
    //       );
    //       setCategories(nonEmptyCategories);
    //     }
    //   })
    //   .catch(console.log);

    getCourse();
  }, []);

  const getCourse = async () => {
    try {
      const resp = await postApi(APIPATH.courses, {}, token, logout);
      const filtered: CourseCategory[] = resp.data.filter(
        (cat: CourseCategory) => cat.courses && cat.courses.length > 0
      );
      setCourses(filtered);

      const selectedFromState = location.state?.selectedCategory;
      const validSlug =
        filtered.find((cat: any) => cat.slug === selectedFromState)?.slug ||
        filtered[0]?.slug ||
        "";
      setSelectedCategory(validSlug);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const selectedCategoryData = courses.find(
    (item) => item?.slug == selectedCategory
  );
  const selectedCourses: Course[] = selectedCategoryData?.courses || [];
  console.log(selectedCourses, 'cousessssss')

  return (
    <>
      {/* <ListingFilter /> */}
      <section className="overflow-hidden">
        <div className="listing-page-section">
          <div className="container">
            <div className="listing-page-top">
              <div>
                <h2 className="listing-heading">Courses</h2>
                <p className="text">
                  Explore Our Wide Range Of Courses To Expand Your Skills
                </p>
              </div>
              {/* <button
                type="button"
                className="btn listing-filter-btn"
                data-bs-toggle="offcanvas"
                data-bs-target="#ListingFilter"
                aria-controls="ListingFilter"
              >
                Filter <i className="fa-solid fa-sliders" />
              </button> */}
            </div>

            <div className="category-filter-tabs">
              <ul
                className="courses-tabs mb-4"
                style={{ backgroundColor: "var(--background-light)" }}
              >
                {courses.map((category: any) => (
                  <li key={category.slug} className="nav-item">
                    <button
                      className={`nav-link ${selectedCategory === category.slug ? "active" : ""
                        }`}
                      onClick={() => setSelectedCategory(category.slug)}
                    >
                      {category.category_name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="listing-page-nav">
              <ul className="listing-page-listings">
                {selectedCourses.map((course: any) => (
                  <li
                    key={course.id}
                    className="category-filter-card"
                    data-aos="flip-right"
                  >
             
                    <div className="listing-page-card">
                      <Link to={`/course/${course.slug}`} className="text-decoration-none text-dark d-block">
                        <img
                          src={`${IMAGE_URL}${course.image}`}
                          alt={course.course_name}
                          className="img-fluid"
                        />
                        <span className="category-badge">{course?.category_name}</span>
                        <h3 className="listing-card-name">{course?.course_name}</h3>
                        <p className="course-price mb-3">
                          ₹{course.offer_price}{" "}
                          <span className="mrp-price">₹{course?.price}</span>{" "}
                      <span className="discount-price">
  {course?.discount_type === 'percentage' 
    ? course?.discount + '%' 
    : '₹ ' + course?.discount} OFF
</span>
                        </p>
                        {/* <p className="course-special-listing">
                          {course?.short_desc}
                        </p> */}
                      </Link>

                      <div className="course-card-bottom text-center">
                     
                        <Link to={`/course/${course.slug}`} className="btn-block btn course-action-btn-white d-block">
                          View Details
                        </Link>
                     
                      </div>
                    </div>


                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};


export default CourseListingPage;
