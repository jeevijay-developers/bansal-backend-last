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


const TestStart = () => {
    const navigate = useNavigate()
    return (
        <>
            <section>
                <div className="test-page-header">
                    <div className="container-fluid test-page-container">
                        <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                            <h4 className="text text-dark mb-0 font-500">Features for World-Class Physics</h4>
                            <Link className="navbar-brand ms-auto" to="/dashboard">
                                <img src="/assets/img/logo.png" alt="logo-png" className="img-fluid" />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="test-info-page">
                    <div className="test-left-menu">
                        <div className="test-left-menu-scrolls">
                            <Link to={''} type="button" onClick={() => navigate(-1)} className="text text-decoration-none text-dark font-500 mb-4">
                                    <i className="fa-solid fa-arrow-left" />
                                    Back To Test
                                </Link>
                            <h3 className="sub-heading mb-2">General Instructions:</h3>
                            <p className="text">1.The clock will be set at the server. The countdown timer at the top
                                right
                                corner of screen will display the remaining time available for you to complete the examination.
                                When
                                the timer reaches zero, the examination will end by itself. You need not terminate the
                                examination
                                or submit your paper.</p>
                            <p className="text">2.The Question Palette displayed on the right side of screen will show the
                                status of each question using one of the following symbols:</p>
                            <ul className="genral-test-info-list">
                                <li className="text text-dark">
                                    <img src="/assets/img/dashboard-img/Rectangle 60.png" alt="#" className="info-test-sug" />
                                    You have not visited the question yet.
                                </li>
                                <li className="text text-dark">
                                    <img src="/assets/img/dashboard-img/Rectangle 62.png" alt="#" className="info-test-sug" />
                                    You have not answered the question.
                                </li>
                                <li className="text text-dark">
                                    <img src="/assets/img/dashboard-img/Rectangle 63.png" alt="#" className="info-test-sug" />
                                    You have answered the question.
                                </li>
                                <li className="text text-dark">
                                    <img src="/assets/img/dashboard-img/Rectangle 61.png" alt="#" className="info-test-sug" />
                                    You have NOT answered the question, but have marked the question for review.
                                </li>
                                <li className="text text-dark">
                                    <img src="/assets/img/dashboard-img/Group 63.png" alt="#" className="info-test-sug" />
                                    You have NOT answered the question, but have marked the question for review.
                                </li>
                            </ul>
                            <p className="text mb-4">The Mark For Review status for a question simply indicates that you would
                                like
                                to look at that question again. If a question is answered, but marked for review, then the
                                answer
                                will be considered for evaluation unless the status is modified by the candidate.</p>
                            <h3 className="sub-heading mb-2">Navigating to a Question :</h3>
                            <p className="text">1.The clock will be set at the server. The countdown timer at the top
                                right
                                corner of screen will display the remaining time available for you to complete the examination.
                                When
                                the timer reaches zero, the examination will end by itself. You need not terminate the
                                examination
                                or submit your paper.</p>
                            <p className="text">2.The Question Palette displayed on the right side of screen will show the
                                status of each question using one of the following symbols:</p>
                        </div>
                        <div className="test-left-card-bottom">
                            <div className="d-flex align-items-center justify-content-end gap-3 flex-wrap">
                                
                                <Link to="/test/start2" className="btn btn-primery ms-auto">
                                    Next
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* <div className="test-right-menu d-none d-md-block">
                        <div className="test-right-menu-card">
                            <div className="test-profile-img">
                                <img src="/assets/img/profile-img.png" alt="#" className="img-fluid" />
                            </div>
                            <p className="user-name text-center">Hi, Jhon</p>
                            <p className="text font-500 text-center">+91 12345 01201</p>
                        </div>
                    </div> */}
                </div>
            </section>

        </>
    );
}

export default TestStart;