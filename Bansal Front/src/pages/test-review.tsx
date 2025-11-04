// <!-- remove footer, header from test page -->
// <style>
//     footer{
//         display: none;
//     }
//     header{
//         display: none;
//     }
// </style>
import { Link, useNavigate } from "react-router-dom";

const TestReview = () => {
    const navigate = useNavigate();
    const handleGoToQuestion = () => {
        const input = document.getElementById("question-number") as HTMLInputElement;
        const questionNum = input?.value;
        alert(`Go to question: ${questionNum}`);
        // Add navigation logic here
    };

    return (
        <>

            <section className="overflow-hidden">
                <div className="test-page-header">
                    <div className="container-fluid test-page-container">
                        <div className="live-test-header">
                            <Link className="navbar-brand order-1" to="/dashboard">
                                <img src="/assets/img/logo.png" alt="logo-png" className="img-fluid" />
                            </Link>
                            <div className="test-review-pagination order-3 order-sm-2">
                                <div className="pagination-input">
                                    <label htmlFor="question-number">Go to Question:</label>
                                    <input type="number" id="question-number" name="question-number" min={1} max={30} defaultValue={1} />
                                    <button onClick={handleGoToQuestion}>Go</button>

                                </div>
                            </div>
                            <div className="order-2 order-sm-3">
                                <button onClick={() => navigate(-1)} className="test-menu-close-btn">
                                    <i className="fa-solid fa-xmark" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="test-info-page test-live-submit-page">
                    <div className="livetest-left-menu">
                        <div className="livetest-top-header">
                            <p>Question 1.</p>
                            <span><i className="fa-regular fa-flag" /> Repost</span>
                        </div>
                        <div className="questions-card">
                            <h3 className="question-heading">Q1.What is the mechanism through which cells differentiate in
                                multicellular organisms?</h3>
                            <div className="questions-ans-submit">
                                <input type="radio" className="btn-check" name="options-outlined" id="success-outlined" autoComplete="off" disabled />
                                <label className="btn btn-outline-success" htmlFor="success-outlined">
                                    <span>A</span> Those responsible for an action that may be catastrophic must prove that it
                                    will not harm before proceeding.
                                </label>
                                <input type="radio" className="btn-check" name="options-outlined" id="success-outlined2" autoComplete="off" disabled />
                                <label className="btn btn-outline-success your-answer" htmlFor="success-outlined2">
                                    <span>B</span> Those responsible for an action that may be catastrophic must prove that it
                                    will not harm before proceeding.
                                </label>
                                <input type="radio" className="btn-check" name="options-outlined" id="success-outlined3" autoComplete="off" disabled />
                                <label className="btn btn-outline-success" htmlFor="success-outlined3">
                                    <span>C</span> Those responsible for an action that may be catastrophic must prove that it
                                    will not harm before proceeding.
                                </label>
                                <input type="radio" className="btn-check" name="options-outlined" id="success-outlined4" autoComplete="off" disabled />
                                <label className="btn btn-outline-success right-answer" htmlFor="success-outlined4">
                                    <span>D</span> Those responsible for an action that may be catastrophic must prove that it
                                    will not harm before proceeding.
                                </label>
                            </div>
                        </div>
                        <div className="live-test-footer">
                            <div className="questions-count">
                                <h2 className="qcount-heading">Question 1 Of 30</h2>
                                <p className="time-period-count">53 Minutes 35 Seconds</p>
                            </div>
                            <div className="qsec-btns-group">
                                <button className="question-action-btn me-3">Previous</button>
                                <button className="text-right-btm-btn">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}

export default TestReview;