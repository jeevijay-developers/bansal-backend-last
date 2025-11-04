import { Link } from "react-router-dom";
import { useEffect } from "react";
// import Faqs from "../components/faqs";
// import Testimonials from "../components/testimonials";
import AOS from 'aos';

const BookStore = () => {
    useEffect(() => {
        const strip = document.querySelector('.book-hero-offer-strip');
        const stripItem = document.querySelector('.strip-item');

        if (strip && stripItem) {
            const text = stripItem.textContent;
            const href = stripItem.getAttribute('href');

            if (href) {
                // Create a duplicate of the text
                const duplicate = document.createElement('a');
                duplicate.href = href;
                duplicate.className = "strip-item";
                duplicate.textContent = text;
                strip.appendChild(duplicate);
            }
        }
    }, []);

    useEffect(()=>{
     AOS.init();
},[])

    return (
        <>
            <section className="overflow-hidden">
                <div className="book-hero-section"  data-aos="fade-down">
                    <Link to="#" className="book-hero-link">
                        <img src="/assets/img/book-banner.png" alt="#" className="img-fluid" />
                    </Link>
                    <div className="book-strip-slide">
                        <div className="book-hero-offer-strip">
                            <Link to="#1" className="strip-item">Use Code DEAL10 At Checkout To Get 10% OFF On Your First Purchase!* </Link>
                        </div>
                    </div>
                </div>
            </section>
            <section className="overflow-hidden">
                <div className="bg-light">
                    <div className="container">
                        <div className="ideal-course-section">
                            <h2 className="heading mb-4 text-center">Explore <span> The Books For You!</span></h2>
                            <div className="row">
                                <div className="col-md-4 mb-4 mb-md-0" data-aos="flip-left">
                                    <div className="ideal-course-card bg-white border-primery">
                                        <h3 className="ideal-course-title">JEE</h3>
                                        <div className="ideal-course-card-footer">
                                            <Link to="/books">
                                                View<i className="fa-solid fa-arrow-right" />
                                            </Link>
                                            <img src="/assets/img/online-course-1.png" alt="#" className="ideal-course-img" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-4 mb-md-0" data-aos="flip-left">
                                    <div className="ideal-course-card bg-white border-primery">
                                        <h3 className="ideal-course-title">NEET</h3>
                                        <div className="ideal-course-card-footer">
                                            <Link to="/books">
                                                View<i className="fa-solid fa-arrow-right" />
                                            </Link>
                                            <img src="/assets/img/online-course-2.png" alt="#" className="ideal-course-img" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-4 mb-md-0" data-aos="flip-left">
                                    <div className="ideal-course-card bg-white border-primery">
                                        <h3 className="ideal-course-title">Class 6-10</h3>
                                        <div className="ideal-course-card-footer">
                                            <Link to="/books">
                                                View<i className="fa-solid fa-arrow-right" />
                                            </Link>
                                            <img src="/assets/img/online-course-3.png" alt="#" className="ideal-course-img" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="overflow-hidden">
                <div className="book-listing-section">
                    <div className="container">
                        <h2 className="heading mb-4 text-center">Latest Release</h2>
                        <div className="row">
                            <div className="col-md-6 col-lg-4 mb-4" data-aos="zoom-out-left">
                                <div className="book-card">
                                    <img src="/assets/img/book-card.png" alt="#" className="img-fluid" />
                                    <Link to="index.php?page=book-details" className="text-decoration-none"><h3 className="book-title">Crack NEET 2025 with Bansal AITS 180 - Your Ultimate Mock Test Series for Success!"</h3></Link>
                                    <p className="course-price" style={{ fontSize: 20 }}>
                                        ₹1800
                                        <span className="mrp-price">2000</span>
                                        <span className="discount-price">{/*?php echo round((2000 - 1800) / 2000 * 100); ?*/}% </span>
                                    </p>
                                    <div className="test-series-btn-group">
                                        <Link to="/book/details" className="btn course-action-btn-white">Buy Now</Link>
                                        <button type="button" className="btn course-action-btn-prime">Add To cart</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 mb-4" data-aos="zoom-out">
                                <div className="book-card">
                                    <img src="/assets/img/book-card.png" alt="#" className="img-fluid" />
                                    <Link to="index.php?page=book-details" className="text-decoration-none"><h3 className="book-title">Crack NEET 2025 with Bansal AITS 180 - Your Ultimate Mock Test Series for Success!"</h3></Link>
                                    <p className="course-price" style={{ fontSize: 20 }}>
                                        ₹1800
                                        <span className="mrp-price">2000</span>
                                        <span className="discount-price">{/*?php echo round((2000 - 1800) / 2000 * 100); ?*/}% </span>
                                    </p>
                                    <div className="test-series-btn-group">
                                        <Link to="/book/details" className="btn course-action-btn-white">Buy Now</Link>
                                        <button type="button" className="btn course-action-btn-prime">Add To cart</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 mb-4" data-aos="zoom-out-right">
                                <div className="book-card">
                                    <img src="/assets/img/book-card.png" alt="#" className="img-fluid" />
                                    <Link to="index.php?page=book-details" className="text-decoration-none"><h3 className="book-title">Crack NEET 2025 with Bansal AITS 180 - Your Ultimate Mock Test Series for Success!"</h3></Link>
                                    <p className="course-price" style={{ fontSize: 20 }}>
                                        ₹1800
                                        <span className="mrp-price">2000</span>
                                        <span className="discount-price">{/*?php echo round((2000 - 1800) / 2000 * 100); ?*/}% </span>
                                    </p>
                                    <div className="test-series-btn-group">
                                        <Link to="/book/details" className="btn course-action-btn-white">Buy Now</Link>
                                        <button type="button" className="btn course-action-btn-prime">Add To cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="overflow-hidden">
                <div className="book-listing-section">
                    <div className="container">
                        <h2 className="heading mb-4 text-center">Best Selling JEE Books</h2>
                        <div className="row">
                            <div className="col-md-6 col-lg-4 mb-4" data-aos="zoom-out-left">
                                <div className="book-card">
                                    <img src="/assets/img/book-card.png" alt="#" className="img-fluid" />
                                    <Link to="index.php?page=book-details" className="text-decoration-none"><h3 className="book-title">Crack NEET 2025 with Bansal AITS 180 - Your Ultimate Mock Test Series for Success!"</h3></Link>
                                    <p className="course-price" style={{ fontSize: 20 }}>
                                        ₹1800
                                        <span className="mrp-price">2000</span>
                                        <span className="discount-price">{/*?php echo round((2000 - 1800) / 2000 * 100); ?*/}% </span>
                                    </p>
                                    <div className="test-series-btn-group">
                                        <Link to="/book/details" className="btn course-action-btn-white">Buy Now</Link>
                                        <button type="button" className="btn course-action-btn-prime">Add To cart</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-4" data-aos="zoom-out">
                                <div className="book-card">
                                    <img src="/assets/img/book-card.png" alt="#" className="img-fluid" />
                                    <Link to="index.php?page=book-details" className="text-decoration-none"><h3 className="book-title">Crack NEET 2025 with Bansal AITS 180 - Your Ultimate Mock Test Series for Success!"</h3></Link>
                                    <p className="course-price" style={{ fontSize: 20 }}>
                                        ₹1800
                                        <span className="mrp-price">2000</span>
                                        <span className="discount-price">{/*?php echo round((2000 - 1800) / 2000 * 100); ?*/}% </span>
                                    </p>
                                    <div className="test-series-btn-group">
                                        <Link to="/book/details" className="btn course-action-btn-white">Buy Now</Link>
                                        <button type="button" className="btn course-action-btn-prime">Add To cart</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-4" data-aos="zoom-out-right">
                                <div className="book-card">
                                    <img src="/assets/img/book-card.png" alt="#" className="img-fluid" />
                                    <Link to="index.php?page=book-details" className="text-decoration-none"><h3 className="book-title">Crack NEET 2025 with Bansal AITS 180 - Your Ultimate Mock Test Series for Success!"</h3></Link>
                                    <p className="course-price" style={{ fontSize: 20 }}>
                                        ₹1800
                                        <span className="mrp-price">2000</span>
                                        <span className="discount-price">{/*?php echo round((2000 - 1800) / 2000 * 100); ?*/}% </span>
                                    </p>
                                    <div className="test-series-btn-group">
                                        <Link to="/book/details" className="btn course-action-btn-white">Buy Now</Link>
                                        <button type="button" className="btn course-action-btn-prime">Add To cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="overflow-hidden">
                <div className="book-listing-section">
                    <div className="container">
                        <h2 className="heading mb-4 text-center">Best Selling School and Olympiad Books</h2>
                        <div className="row">
                            <div className="col-lg-4 col-md-6 mb-4" data-aos="zoom-out-left">
                                <div className="book-card">
                                    <img src="/assets/img/book-card.png" alt="#" className="img-fluid" />
                                    <Link to="index.php?page=book-details" className="text-decoration-none"><h3 className="book-title">Crack NEET 2025 with Bansal AITS 180 - Your Ultimate Mock Test Series for Success!"</h3></Link>
                                    <p className="course-price" style={{ fontSize: 20 }}>
                                        ₹1800
                                        <span className="mrp-price">2000</span>
                                        <span className="discount-price">{/*?php echo round((2000 - 1800) / 2000 * 100); ?*/}% </span>
                                    </p>
                                    <div className="test-series-btn-group">
                                        <Link to="/book/details" className="btn course-action-btn-white">Buy Now</Link>
                                        <button type="button" className="btn course-action-btn-prime">Add To cart</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-4" data-aos="zoom-out">
                                <div className="book-card">
                                    <img src="/assets/img/book-card.png" alt="#" className="img-fluid" />
                                    <Link to="index.php?page=book-details" className="text-decoration-none"><h3 className="book-title">Crack NEET 2025 with Bansal AITS 180 - Your Ultimate Mock Test Series for Success!"</h3></Link>
                                    <p className="course-price" style={{ fontSize: 20 }}>
                                        ₹1800
                                        <span className="mrp-price">2000</span>
                                        <span className="discount-price">{/*?php echo round((2000 - 1800) / 2000 * 100); ?*/}% </span>
                                    </p>
                                    <div className="test-series-btn-group">
                                        <Link to="/book/details" className="btn course-action-btn-white">Buy Now</Link>
                                        <button type="button" className="btn course-action-btn-prime">Add To cart</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-4" data-aos="zoom-out-right">
                                <div className="book-card">
                                    <img src="/assets/img/book-card.png" alt="#" className="img-fluid" />
                                    <Link to="index.php?page=book-details" className="text-decoration-none"><h3 className="book-title">Crack NEET 2025 with Bansal AITS 180 - Your Ultimate Mock Test Series for Success!"</h3></Link>
                                    <p className="course-price" style={{ fontSize: 20 }}>
                                        ₹1800
                                        <span className="mrp-price">2000</span>
                                        <span className="discount-price">{/*?php echo round((2000 - 1800) / 2000 * 100); ?*/}% </span>
                                    </p>
                                    <div className="test-series-btn-group">
                                        <Link to="/book/details" className="btn course-action-btn-white">Buy Now</Link>
                                        <button type="button" className="btn course-action-btn-prime">Add To cart</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* <Testimonials /> */}
            {/* <Faqs /> */}
        </>
    );
}

export default BookStore;