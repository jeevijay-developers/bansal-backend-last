import { Link } from "react-router-dom";
// import ListingFilter from "../components/listing-filter";
import { postApi } from "../services/services";
import { APIPATH, IMAGE_URL } from "../api/urls";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import LoaderWithBackground from "../components/LoaderWithBackground";

const TestSeriesListing = () => {
    const [loading, setLoading] = useState(false);
    const [testSeriesList, setTestSeriesList] = useState([])
    useEffect(() => {
        getTestSeries();
    }, []);

    const getTestSeries = async () => {
        setLoading(true)
        try {
            const resp = await postApi(APIPATH.testSeriesList);
            console.log(resp, 'test');

            const { data, message, success } = resp;
            if (success) {
                setTestSeriesList(data);
            } else {
                toast.error(message || "Failed to fetch test series.");
            }
        } catch (error: any) {
            console.error("Error fetching test series:", error);
            toast.error(error?.message || "Something went wrong!");
        } finally {
            setLoading(false)
        }
    };

    return (
        <>
            <LoaderWithBackground visible={loading} />
            {/* <ListingFilter /> */}
            <section>
                <div className="listing-page-section">
                    <div className="container">
                        {/* <div className="listing-page-top">
                            <div>
                                <h2 className="listing-heading">Test Series</h2>
                                <p className="text">Explore Our Wide Range Of Courses To Expand Your Skills</p>
                            </div>
                            <button type="button" className="btn listing-filter-btn" data-bs-toggle="offcanvas" data-bs-target="#ListingFilter" aria-controls="ListingFilter">Filter <i className="fa-solid fa-sliders" /></button>
                        </div> */}
                        <div className="row mb-4">
                            {testSeriesList && testSeriesList.map((test: any) => (
                                <div key={test.id} className="col-lg-4 col-md-6 mb-4">
                                    <div className="test-series-card">
                                        <Link to={`/test-series/${test?.slug}`} className="text-decoration-none text-dark d-block" >
                                        <div className="test-series-card-top">
                                            <img
                                                src={test?.image ? `${IMAGE_URL}${test?.image}` : '/assets/img/no_image.jpg'}
                                                alt="#" className="img-fluid" />
                                            <p className="test-series-card-badge">₹{test?.offer_price ? test?.offer_price : test?.price}</p>
                                        </div>
                                        <h3 className="test-series-card-title">{test?.name}</h3>
                                        <p dangerouslySetInnerHTML={{ __html: test?.description }} />
                                        </Link>
                                        <div className="test-series-btn-group">
                                            <Link to={`/test-series/${test?.slug}`} className="btn course-action-btn-white">View Details</Link>
                                            {/* <Link to="#" className="btn course-action-btn-prime">Enroll now</Link> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
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

export default TestSeriesListing;

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