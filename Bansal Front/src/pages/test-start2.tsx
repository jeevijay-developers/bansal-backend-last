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


const TestStart2 = () => {
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
                            <Link to=" " type="button" onClick={() => navigate(-1)} className="text text-decoration-none text-dark font-500 mb-4">
                                <i className="fa-solid fa-arrow-left" />
                                Back
                            </Link>
                            <h3 className="sub-heading mb-4">Live Test</h3>
                            <div className="live-test-cards">
                                <p>Duration: 10 Mins</p>
                                <p>Maximum Marks: 20</p>
                            </div>
                            <h3 className="sub-heading mb-4">Read The Following Instructions Carefully.</h3>
                            <p className="text">
                                1.Read the following instructions carefully.
                                <br /> 2.Each question has 4 options out of which only one is correct.
                                <br /> 3.You have to finish the test in 10 minutes.
                                <br /> 4.Try not to guess the answer as there is negative marking.
                                <br /> 5.You will be awarded 1&nbsp;mark for each correct answer and 0.33&nbsp;marks will be deducted for each wrong&nbsp;answer.
                                <br /> 6.There is no negative marking for the questions that you have not attempted.
                                <br /> 7.Make sure that you complete the&nbsp;test before you submit the test and/or close the browser.
                            </p>
                        </div>
                        <div className="test-left-card-bottom">
                            <div className="test-condition-agree-card">
                                <div className="form-check mb-3">
                                    <input className="form-check-input form-check-prime" type="checkbox" defaultValue='' id="flexCheckDefault" />
                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                        I have read all the instructions carefully and have understood them. I agree not to
                                        cheat or use unfair means in this examination. I understand that using unfair means of
                                        any sort for my own or someone else’s advantage will lead to my immediate
                                        disqualification.
                                    </label>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-end gap-3 flex-wrap">

                                <Link to="/test/live" className="btn btn-primery ms-auto">
                                    I am ready to begin
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

export default TestStart2;