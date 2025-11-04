import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { postApi } from "../services/services";
import { useAuthStore } from "../store/auth/authStore";
import { APIPATH, IMAGE_URL } from "../api/urls";
import LoaderWithBackground from "../components/LoaderWithBackground";


const CenterDetails = () => {
    const [courseList, setCourseList] = useState<any>([]);
    const [centerDetails, setCenterDetails] = useState<any>("")
    const [loading, setLoading] = useState(false);
    const { token, logout } = useAuthStore();
    const { id } = useParams()
    // console.log(id, 'dfdafads')
    const CenterId = id
    useEffect(() => {
        fetchCenters(CenterId)
    }, [])
    const fetchCenters = async (CenterId: any) => {
        setLoading(true);
        try {
            const resp = await postApi(APIPATH.getCenterDetails, { center_id: CenterId }, token, logout)
            console.log(resp, 'resp')
            const { success, data, courses } = resp;
            if (success) {
                setCenterDetails(data)
                setCourseList(courses);
            }
        } catch (error) {
            console.error("Error fetching course:", error);

        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('click', function (this: HTMLElement) {
                const img = this.querySelector('img');
                const imgSrc = img?.src;
                if (!imgSrc) return;

                const modal = document.createElement('div');
                modal.className = 'gallery-modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <span class="close-modal">&times;</span>
                        <img src="${imgSrc}" alt="Gallery Image" class="img-fluid">
                    </div>
                `;
                document.body.appendChild(modal);

                modal.querySelector('.close-modal')?.addEventListener('click', function () {
                    modal.remove();
                });
            });
        });

        return () => {
            galleryItems.forEach(item => {
                const clone = item.cloneNode(true);
                item.replaceWith(clone);
            });
        };
    }, []);

    return (
        <>
            {/* <div> */}
            <LoaderWithBackground visible={loading} />
            <section>
                <div className="city-hero-section" style={{ background: 'linear-gradient(94.64deg, #6E31AE 0%, #3C105D 50.2%, #561889 100.4%)' }}>
                    <div className="container">
                        <div className="row align-items-center justify-content-between">
                            <div className="col-md-6 mb-4 mb-md-0">
                                <h1 className="hero-heading">
                                    {centerDetails?.name}
                                </h1>
                                <div className="contact-page-links">
                                    <Link
                                        to={centerDetails?.map_url}
                                        className="cu-page-link text-white">
                                        <i className="fa-solid fa-location-dot text-yellow" />
                                        {centerDetails?.address}
                                    </Link>
                                    <Link
                                        to={`tel: ${centerDetails?.mobile}`}
                                        className="cu-page-link text-white">
                                        <i className="fa-solid fa-phone text-yellow" />
                                        {centerDetails?.mobile}
                                    </Link>
                                </div>
                                <div className="hero-btn-group">
                                    <button className="btn hero-main-btn-dark">Book A Visit <i className="fa-solid fa-arrow-right" /></button>
                                    <button className="btn hero-main-btn-white">Download App <i className="fa-brands fa-google-play" /></button>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="hero-slider">
                                    {/* <Slider {...settings}> */}
                                    <div className="item">
                                        <img
                                            src={`${IMAGE_URL}${centerDetails.logo}`}
                                            // src="/assets/img/blog-1.png" 
                                            alt="#"
                                            className="img-fluid city-hero-img" />
                                    </div>
                                    {/* </Slider> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {courseList.length > 0 && (
                <section>
                    <div className="institutes-section">
                        <div className="container">
                            <h3 className="heading text-center mb-4">Explore All Our <span> Courses </span></h3>
                            <div className="row">
                                {courseList.length > 0 ?
                                    (courseList.map((course: any) => (
                                        <div key={course.id} className="col-md-6 col-lg-4 col-xl-3 mb-4">
                                            <div className="listing-page-card">
                                                <span className="course-badge">
                                                    <i className="fa-solid fa-video" /> {course?.batch_type}</span>
                                                <img
                                                    src={`${IMAGE_URL}${course?.image}`}
                                                    alt={course?.course_name} className="img-fluid" />
                                                <span className="category-badge">{course?.category_name}</span>
                                                <h3 className="listing-card-name">{course?.course_name}</h3>
                                                <p className="course-price">
                                                    ₹{course?.offer_price}
                                                    <span className="mrp-price">{course?.price}</span>
                                                    {/* <span className="discount-price">{((course.price - course.offer_price) / course.price) * 100}%</span> */}
                                                </p>
                                                {/* <ul className="course-special-listing">
                                            <li>Morem ipsum dolor sit amet, consectetur</li>
                                            <li>Morem ipsum dolor sit amet, consectetur</li>
                                            <li>Morem ipsum dolor sit amet, consectetur</li>
                                        </ul> */}
                                                <div className="course-card-bottom">
                                                    <Link to={`/course/${course?.slug}`} className="btn course-action-btn-white">View Details</Link>
                                                    <Link to="#" className="btn course-action-btn-prime">Enroll now</Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))) : (
                                        <span>No Courses Available</span>
                                    )}

                            </div>
                            {/* <button type="button" className="btn btn-primery btn-dark mx-auto d-block w-fit-content">Load More</button> */}
                        </div>
                    </div>
                </section>
            )}
            <section>
                <div className="intitutes-gallery-section">
                    <div className="container">
                        <h2 className="heading text-center mb-4">View Inside Institutes.</h2>
                        <div className="row align-items-center justify-content-center">
                            <div className="col-6 col-lg-4 mb-2 mb-sm-4">
                                <div className="row align-items-center justify-content-between">
                                    <div className="col-12 mb-2 mb-sm-4">
                                        <div className="gallery-item">
                                            <img src="/assets/img/blog.png" alt="#" className="img-fluid gallery-image-1" />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="gallery-item">
                                            <img src="/assets/img/blog-1.png" alt="#" className="img-fluid gallery-image-3" />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="gallery-item">
                                            <img src="/assets/img/blog-2.png" alt="#" className="img-fluid gallery-image-3" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-lg-4 mb-2 mb-sm-4">
                                <div className="gallery-item">
                                    <img src="/assets/img/blog-3.png" alt="#" className="img-fluid gallery-image-2" />
                                </div>
                            </div>
                            <div className="col-lg-4 mb-2 mb-sm-4">
                                <div className="row align-items-center justify-content-between">
                                    <div className="col-4 col-lg-6 mb-2 mb-sm-4">
                                        <div className="gallery-item">
                                            <img src="/assets/img/blog-1.png" alt="#" className="img-fluid gallery-image-3" />
                                        </div>
                                    </div>
                                    <div className="col-4 col-lg-6 mb-2 mb-sm-4">
                                        <div className="gallery-item">
                                            <img src="/assets/img/blog-2.png" alt="#" className="img-fluid gallery-image-3" />
                                        </div>
                                    </div>
                                    <div className="col-4 col-lg-12 mb-2 mb-sm-4 mb-lg-0">
                                        <div className="gallery-item">
                                            <img src="/assets/img/blog.png" alt="#" className="img-fluid gallery-image-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <ContactCenter /> */}
           

        </>
    );
}

export default CenterDetails;
