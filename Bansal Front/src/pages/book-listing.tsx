import { Link } from "react-router-dom";
import ListingFilter from "../components/listing-filter";
import { useEffect } from "react";
import AOS from 'aos';

const BookListing = () => {

    useEffect(()=>{
     AOS.init();
},[])

    return (
        <>
        <ListingFilter/>
            <section>
                <div className="listing-page-section">
                    <div className="container">
                        <div className="listing-page-top">
                            <div>
                                <h2 className="listing-heading">Books</h2>
                                <p className="text">Explore Our Wide Range Of Courses To Expand Your Skills</p>
                            </div>
                            <button type="button" className="btn listing-filter-btn" data-bs-toggle="offcanvas" data-bs-target="#ListingFilter" aria-controls="ListingFilter">Filter <i className="fa-solid fa-sliders" /></button>
                        </div>
                        <div className="row mb-4">
                            <div className="col-lg-4 col-md-6 mb-4" data-aos="zoom-out-left">
                                <div className="book-card">
                                    <img src="/assets/img/book-card.png" alt="#" className="img-fluid" />
                                    <Link to="/book/details" className="text-decoration-none"><h3 className="book-title">Crack NEET 2025 with Bansal AITS 180 - Your Ultimate Mock Test Series for Success!"</h3></Link>
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
                                    <img src="assets/img/book-card.png" alt="#" className="img-fluid" />
                                    <Link to="/book/details" className="text-decoration-none"><h3 className="book-title">Crack NEET 2025 with Bansal AITS 180 - Your Ultimate Mock Test Series for Success!"</h3></Link>
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
                                    <img src="assets/img/book-card.png" alt="#" className="img-fluid" />
                                    <Link to="/book/details" className="text-decoration-none"><h3 className="book-title">Crack NEET 2025 with Bansal AITS 180 - Your Ultimate Mock Test Series for Success!"</h3></Link>
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
                            <div className="col-lg-4 col-md-6 mb-4" data-aos="zoom-out-left">
                                <div className="book-card">
                                    <img src="assets/img/book-card.png" alt="#" className="img-fluid" />
                                    <Link to="/book/details" className="text-decoration-none"><h3 className="book-title">Crack NEET 2025 with Bansal AITS 180 - Your Ultimate Mock Test Series for Success!"</h3></Link>
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
                                    <img src="assets/img/book-card.png" alt="#" className="img-fluid" />
                                    <Link to="/book/details" className="text-decoration-none"><h3 className="book-title">Crack NEET 2025 with Bansal AITS 180 - Your Ultimate Mock Test Series for Success!"</h3></Link>
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
                                    <img src="assets/img/book-card.png" alt="#" className="img-fluid" />
                                    <Link to="/book/details" className="text-decoration-none"><h3 className="book-title">Crack NEET 2025 with Bansal AITS 180 - Your Ultimate Mock Test Series for Success!"</h3></Link>
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
                        {/* <div className="listing-pagenation">
                            <nav aria-label="Page navigation">
                                <ul className="pagination">
                                    <li className="page-item">
                                        <Link className="page-link" to="#"><i className="fa-solid fa-chevron-left" /></Link>
                                    </li>
                                    <li className="page-item"><Link className="page-link" to="#">1</Link></li>
                                    <li className="page-item active" aria-current="page">
                                        <Link className="page-link" to="#">2</Link>
                                    </li>
                                    <li className="page-item"><Link className="page-link" to="#">3</Link></li>
                                    <li className="page-item">
                                        <Link className="page-link" to="#"><i className="fa-solid fa-chevron-right" /></Link>
                                    </li>
                                </ul>
                            </nav>
                        </div> */}
                    </div>
                </div>
            </section>

        </>
    );
}

export default BookListing;

{/* <script>
    document.addEventListener("DOMContentLoaded", function () {
        const filterButtons = document.querySelectorAll(".courses-tabs .nav-link");
        const courseCards = document.querySelectorAll(".category-filter-card");

        filterButtons.forEach(button => {
            button.addEventListener("click", function () {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove("active"));

                // Add active class to the clicked button
                this.classList.add("active");

                // Get the selected category
                const selectedCategory = this.getAttribute("data-category");

                // Show/hide course cards based on the selected category
                courseCards.forEach(card => {
                    if (selectedCategory === "all" || card.getAttribute("data-category") === selectedCategory) {
                        card.style.display = "block";
                    } else {
                        card.style.display = "none";
                    }
                });
            });
        });
    });
</script> */}