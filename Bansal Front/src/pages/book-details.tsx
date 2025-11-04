import { useState } from "react";
import { Link } from "react-router-dom";
const imageList: string[] = [
    '/assets/img/book-card.png',
    '/assets/img/book.png',
    
];
const BookDetails = () => {
    const [mainImage, setMainImage] = useState<string>(imageList[0]);
    return (
        <>
            <div>
                <section>
                    <div className="book-details-page">
                        <div className="container">
                            <p className="book-details-page-links">
                                <Link to="/">Home</Link> / <Link to="/books"> Best Seller - Grade 11 - JEE</Link> / Bansal Smart JEE Advanced Rank Accelerator 2025- 3 book set for PCM
                            </p>
                            <div className="row">
                                <div className="col-lg-6 col-xl-5 mb-4">
                                    <div className="book-details-images">
                                        <div className="main-image-book-details">
                                            <img src={mainImage} alt="Main Book" className="img-fluid" id="MainImageCard" />
                                        </div>
                                        <ul className="bookdetails-image-list">
                                            {imageList.map((src, index) => (
                                                <li key={index}>
                                                    <button
                                                        className={`bdetails-image-link ${mainImage === src ? 'active' : ''}`}
                                                        onClick={() => setMainImage(src)}
                                                        // style={{ border: 'none', background: 'transparent', padding: 0 }}
                                                    >
                                                        <img src={src} alt={`Book Thumbnail ${index + 1}`} className="img-fluid" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-xl-7 mb-4">
                                    <div className="book-details-right-card">
                                        <div className="bdp-top-badges">
                                            <span className="bdp-top-right-badge">Set Of - 3 Books</span>
                                            <span className="bdp-top-right-badge">Edition - 2024</span>
                                            <Link to="#" className="ms-0 ms-md-auto d-flex"><i className="fa-solid fa-share-nodes" /></Link>
                                        </div>
                                        <h2 className="heading mb-4 book-detail-title">Crack NEET 2025 with Bansal AITS 180 – Your Ultimate Mock Test Series for Success!"</h2>
                                        <div className="book-details-price">
                                            <p className="book-offer-price">₹1,800</p>
                                            <p className="book-max-price">2000</p>
                                            <span className="book-discount-badge">Off {/*?php echo round((2000 - 1800) / 2000 * 100); ?*/}% </span>
                                        </div>
                                        <p className="book-details-price-note">Tax included.&nbsp;Shipping&nbsp;calculated at checkout.</p>
                                        <div className="book-details-page-actions">
                                            <button type="button" className="btn course-action-btn-white">Buy Now</button>
                                            <button type="button" className="btn course-action-btn-prime">Add To cart</button>
                                        </div>
                                        <div className="book-details-accordion">
                                            <div className="faq-card">
                                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header" id="flush-headingOne">
                                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="true" aria-controls="flush-collapseOne">
                                                                Product Description
                                                            </button>
                                                        </h2>
                                                        <div id="flush-collapseOne" className="accordion-collapse collapse show" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                                            <div className="accordion-body">
                                                                <h6 className="product-disc-name">Crack IIT JEE 2025 with Vedantu’s Power-Packed Study Books!</h6>
                                                                <p className="text text-dark">Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur neque. Ut diam quam, semper iaculis condimentum ac, vestibulum eu nisl. Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur neque. Ut diam quam, semper iaculis condimentum ac, vestibulum eu nisl.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header" id="flush-headingTwo">
                                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                                                Book Structure
                                                            </button>
                                                        </h2>
                                                        <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                                                            <div className="accordion-body">
                                                                <p className="text text-dark">Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur neque. Ut diam quam, semper iaculis condimentum ac, vestibulum eu nisl. Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur neque. Ut diam quam, semper iaculis condimentum ac, vestibulum eu nisl.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header" id="flush-headingThree">
                                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                                                Other Information
                                                            </button>
                                                        </h2>
                                                        <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                                                            <div className="accordion-body">
                                                                <p className="text text-dark">Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur neque. Ut diam quam, semper iaculis condimentum ac, vestibulum eu nisl. Gorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur neque. Ut diam quam, semper iaculis condimentum ac, vestibulum eu nisl.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="book-details-bottom-cards">
                                            <div className="row">
                                                <div className="col-md-4 mb-4">
                                                    <div className="bdb-card bdb-card-1">
                                                        <img src="/assets/img/bd-1.png" alt="#" className="img-fluid" />
                                                        <h4>Safe and Secure Payments</h4>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 mb-4">
                                                    <div className="bdb-card bdb-card-2">
                                                        <img src="/assets/img/bd-2.png" alt="#" className="img-fluid" />
                                                        <h4>Easy Returnsand Refund</h4>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 mb-4">
                                                    <div className="bdb-card bdb-card-3">
                                                        <img src="/assets/img/bd-3.png" alt="#" className="img-fluid" />
                                                        <h4>Guaranteed Shipping</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="book-listing-section book-details-page-listing">
                        <div className="container">
                            <h2 className="heading mb-4 text-center">Similar products you may like&nbsp;</h2>
                            <div className="row">
                                <div className="col-lg-4 col-md-6 mb-4">
                                    <div className="book-card">
                                        <img src="/assets/img/book-card.png" alt="#" className="img-fluid" />
                                        <Link to="/book/details" className="text-decoration-none"><h3 className="book-title">Crack NEET 2025 with Bansal AITS 180 - Your Ultimate Mock Test Series for Success!"</h3></Link>
                                        <p className="course-price" style={{ fontSize: 20 }}>
                                            ₹1800
                                            <span className="mrp-price">2000</span>
                                            <span className="discount-price">{/*?php echo round((2000 - 1800) / 2000 * 100); ?*/}% </span>
                                        </p>
                                        <div className="test-series-btn-group">
                                            <Link to="#" className="btn course-action-btn-white">Buy Now</Link>
                                            <button type="button" className="btn course-action-btn-prime">Add To cart</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 mb-4">
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
                                <div className="col-lg-4 col-md-6 mb-4">
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
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        </>
    );
}

export default BookDetails;
{/* <script>
    document.addEventListener("DOMContentLoaded", function () {
        const mainImage = document.getElementById("MainImageCard");
        const imageLinks = document.querySelectorAll(".bdetails-image-link img");
        imageLinks.forEach(link => {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                mainImage.src = this.src;
                document.querySelectorAll(".bdetails-image-link").forEach(item => {
                    item.classList.remove("active");
                });
                this.parentElement.classList.add("active");
            });
        });
    });
</script> */}

