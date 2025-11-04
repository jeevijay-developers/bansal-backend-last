import { Link } from "react-router-dom";
import ContactCenter from "../components/contactCenter";
import { useEffect, useState } from "react";
import { postApi } from "../services/services";
import { APIPATH, IMAGE_URL } from "../api/urls";
import { useAuthStore } from "../store/auth/authStore";
import LoaderWithBackground from "../components/LoaderWithBackground";

const Centers = () => {
    const [centerList, setCenterList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token, logout } = useAuthStore();
    useEffect(() => {
        fetchCenters()
    }, [])
    const fetchCenters = async () => {
        setLoading(true);
        try {
            const resp = await postApi(APIPATH.getOfflineCenter, {}, token, logout)
            console.log(resp, 'resp')
            const { success, data, cities } = resp;
            if (success) {
                setCenterList(data);
                setCityList(cities)
            }
        } catch (error) {
            console.error("Error fetching course:", error);

        } finally {
            setLoading(false)
        }
        // postApi(APIPATH.getOfflineCenter, {}, token, logout)
        //   .then((resp) => {
        //     console.log(resp, 'resp')
        //     const { success, data, message } = resp;
        //     if (success) setCenterList(data);
        //     else toast.error(message);
        //   })
        //   .catch(console.log)
        //   .finally(() => setLoading(false));
    };
    return (
        <>
            {/* <SearchCity city={cityCenters} /> */}
            <LoaderWithBackground visible = {loading}/>
            <div>
                {/* <section>
                    <div className="offline-hero-section">
                        <div className="container">
                            <div className="row align-items-center justify-content-between">
                                <div className="col-md-6 mb-4 mb-md-0">
                                    <h1 className="hero-heading">
                                        "Now Offline In Your City! Visit Us For In-<span>Person Learning</span>
                                    </h1>
                                    <p className="hero-badge-text">Offline Courses for <span>JEE I NEET I 8-10 Foundation</span></p>
                                    <div className="hero-btn-group">
                                        <button className="btn hero-main-btn-dark">Book A Visit <i className="fa-solid fa-arrow-right" /></button>
                                        <button className="btn hero-main-btn-white">Download App <i className="fa-brands fa-google-play" /></button>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="offline-center-hero-video">
                                        <video className="img-fluid d-block" id="HeroVideo" poster="/assets/img/Frame-001.png">
                                            <source src="/assets/video/mov_bbb.mp4" type="video/mp4" />
                                        </video>
                                        <button type="button" className="hero-play-button"><i className="fa-solid fa-play" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}
                <section>
                    <div className="ocenter-city-section">
                        <div className="container">
                            <h3 className="heading text-center mb-4">We're Now in Your City - Visit Our <span> Nearest Centre!</span></h3>
                            <div className="row">
                                {cityList.map((city: any) => (
                                    <div className="col-sm-6 col-lg-4 col-xl-3 mb-4" key={city.id}>
                                        <Link to="/city/centers" className="text-decoration-none city-hover-ef">
                                            <div className="city-card">
                                                <img
                                                    src={`${IMAGE_URL}${city.image}`}
                                                    alt={city.title} className="img-fluid" />
                                                <h4 className="city-name">{city.title}</h4>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            {/* <button
                                type="button"
                                className="btn btn-primery mx-auto d-block w-fit-content"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasRight"
                                // onClick={() => setShowSidebar(true)}
                                aria-controls="offcanvasRight"
                            >
                                View All
                            </button> */}
                            {/* <button type="button" className="btn btn-primery mx-auto d-block w-fit-content" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">View All</button> */}
                        </div>
                    </div>
                </section>
                <section>
                    <div className="institutes-section">
                        <div className="container">
                            <h3 className="heading text-center mb-4">Learn With One Of The City's Most Popular And <span> Preferred Institutes</span>.</h3>
                            <div className="row">
                                {centerList && centerList.map((center:any) => (
                                    <div key={center.id} className="col-md-6 col-lg-4 mb-4">
                                        <div className="institute-card">
                                            <img 
                                            src={`${IMAGE_URL}${center.logo}`} 
                                            alt="#" className="img-fluid" />
                                            <h4>Bansal smart Class, jaipur </h4>
                                            <p><i className="fa-solid fa-location-dot" /> Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016</p>
                                            <div className="institute-btn-group">
                                                <Link to="/city/center/details" className="btn course-action-btn-white">View Details</Link>
                                                <Link to="index.php?page=contact" className="btn course-action-btn-prime">Contact US</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="col-md-6 col-lg-4 mb-4">
                                    <div className="institute-card">
                                        <img src="/assets/img/blog-1.png" alt="#" className="img-fluid" />
                                        <h4>Bansal smart Class, jaipur </h4>
                                        <p><i className="fa-solid fa-location-dot" /> Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016</p>
                                        <div className="institute-btn-group">
                                            <Link to="/city/center/details" className="btn course-action-btn-white">View Details</Link>
                                            <Link to="index.php?page=contact" className="btn course-action-btn-prime">Contact US</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4 mb-4">
                                    <div className="institute-card">
                                        <img src="/assets/img/blog-2.png" alt="#" className="img-fluid" />
                                        <h4>Bansal smart Class, jaipur </h4>
                                        <p><i className="fa-solid fa-location-dot" /> Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016</p>
                                        <div className="institute-btn-group">
                                            <Link to="/city/center/details" className="btn course-action-btn-white">View Details</Link>
                                            <Link to="index.php?page=contact" className="btn course-action-btn-prime">Contact US</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Link to="/city/centers" className="btn btn-primery btn-dark mx-auto d-block w-fit-content">View All</Link>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="interactive-section">
                        <div className="container">
                            <h2 className="heading text-center mb-4">Discover The Future Of Learning - <span> Interactive And Immersive</span></h2>
                            <div className="row  justify-content-center">
                                <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                                    <div className="interactive-section-card">
                                        <img src="/assets/img/interactive.png" alt="#" className="img-fluid" />
                                        <h3 className="interactive-material-title">
                                            Cutting-edge Curriculum &amp; Tools
                                        </h3>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                                    <div className="interactive-section-card">
                                        <img src="/assets/img/interactive-1.png" alt="#" className="img-fluid" />
                                        <h3 className="interactive-material-title">
                                            Hands-on Training with Expert Mentors
                                        </h3>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                                    <div className="interactive-section-card">
                                        <img src="/assets/img/interactive-2.png" alt="#" className="img-fluid" />
                                        <h3 className="interactive-material-title">
                                            Now Available Offline in Your City
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="our-video-section">
                        <div className="container">
                            <div className="row align-items-center justify-content-between">
                                <div className="col-md-5 mb-4 mb-md-0">
                                    <div className="our-video">
                                        <video className="img-fluid d-block" id="OurVideo" poster="/assets/img/Frame-82.png">
                                            <source src="/assets/video/mov_bbb.mp4" type="video/mp4" />
                                        </video>
                                        <button type="button" className="video-play-button"><i className="fa-solid fa-circle-play" /> Inside View</button>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-7">
                                    <h2 className="heading mb-4">Discover Learning Like Never Before – Interactive Classes &amp; Guided <span> Tours Available</span>.</h2>
                                    <ul className="our-video-list">
                                        <li>Get Personalized Guidance and Course Recommendations with Link FREE Counseling Session.</li>
                                        <li>Attend FREE Demo Classes Conducted by Top Master Teachers.</li>
                                        <li>Unlock Exclusive Offers – Visit Us Today!</li>
                                    </ul>
                                    <Link to="index.php?page=contact" className="btn btn-primery">Contact Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="trust-contact-section">
                        <div className="container">
                            <div className="row justify-content-between align-items-center">
                                <div className="col-lg-7">
                                    <h2 className="mb-4 heading">Trusted By Thousands For Excellence, <span> Innovation, And Results</span></h2>
                                    <div className="riv-section-list">
                                        <p><img src="/assets/img/training.svg" alt="#" className="img-fluid" /> Expert Faculty</p>
                                        <p><img src="/assets/img/university-campus.svg" alt="#" className="img-fluid" /> Modern Campus</p>
                                        <p><img src="/assets/img/reading-book.svg" alt="#" className="img-fluid" /> Practical Learning</p>
                                        <p><img src="/assets/img/calendar.svg" alt="#" className="img-fluid" /> Flexible Scheduling</p>
                                        <p><img src="/assets/img/product.svg" alt="#" className="img-fluid" /> Placement Assistance</p>
                                        <p><img src="/assets/img/document.svg" alt="#" className="img-fluid" /> Industry-Recognized Certifications</p>
                                    </div>
                                    <Link to="index.php?page=contact" className=" btn btn-primery">Book Free Consultancy <i className="fa-solid fa-arrow-right" /></Link>
                                </div>
                                <div className="col-md-5 mx-auto mx-md-0">
                                    <img src="/assets/img/trust-img.png" alt="#" className="img-fluid" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* <Testimonials /> */}
                <ContactCenter />
                {/* <Faqs /> */}
            </div>

        </>
    );
}

export default Centers;