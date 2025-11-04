// import Faqs from "../components/faqs";
import TestSeries from "../components/test-series";
import Testimonials from "../components/testimonials";

const testSeries = () => {
    return (
        <>
            <section>
                <div className="test-series-hero">
                    <div className="container">
                        <div className="row align-items-center justify-content-between">
                            <div className="col-lg-6 col-md-7 mb-4 mb-md-0">
                                <h1 className="test-series-heading">India's Premier Platform for Structured Online Test Series.</h1>
                                <div className="test-series-search-card">
                                    <label htmlFor="SearchInputBox" className="form-label">300+ Exams Covered — Which One Are You Preparing For?</label>
                                    <div className="search-input-align">
                                        <div className="search-input-magnify">
                                            <input type="text" className="form-control" placeholder="Search Your Exam" />
                                            <i className="fa-solid fa-magnifying-glass" />
                                        </div>
                                        <button type="button" className="test-search-btn btn">Search</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <img src="/assets/img/test-series.png" alt="#" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <TestSeries />
            <Testimonials />
            {/* <Faqs /> */}
        </>
    );
}

export default testSeries;
