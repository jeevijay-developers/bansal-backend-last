import { Link } from "react-router-dom";

const TestSeries = () => {
    return (
        <>
            <section>
                <div className="test-series-section">
                    <div className="container">
                        <div className="d-flex align-itme-center justify-content-between gap-3 mb-4">
                            <h2 className="heading">Test Series</h2>
                            <Link to="/test-series" className="btn secondary-btn">View All</Link>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="test-series-card">
                                    <div className="test-series-card-top">
                                        <img src="/assets/img/course-logo.png" alt="#" className="img-fluid" />
                                        <p className="test-series-card-badge">₹1,800</p>
                                    </div>
                                    <h3 className="test-series-card-title">UP TGT Mock Test Series 2025</h3>
                                    <ul className="test-series-card-listing">
                                        <li> 4 Mega Live Test Marathon
                                        </li>
                                        <li> 10 Rapid Revision Mini Full Test
                                        </li>
                                        <li> 312 Chapter Test
                                        </li>
                                        <li> 312 Chapter Test
                                        </li>
                                        <li> 312 Chapter Test
                                        </li>
                                        <li className="text-secondary"> 26More +</li>
                                    </ul>
                                    <div className="test-series-btn-group">
                                        <Link to="/jee/test-series" className="btn course-action-btn-white">View Details</Link>
                                        <Link to="#" className="btn course-action-btn-prime">Enroll now</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="test-series-card">
                                    <div className="test-series-card-top">
                                        <img src="/assets/img/course-logo.png" alt="#" className="img-fluid" />
                                        <p className="test-series-card-badge">₹1,800</p>
                                    </div>
                                    <h3 className="test-series-card-title">UP TGT Mock Test Series 2025</h3>
                                    <ul className="test-series-card-listing">
                                        <li> 4 Mega Live Test Marathon
                                        </li>
                                        <li> 10 Rapid Revision Mini Full Test
                                        </li>
                                        <li> 312 Chapter Test
                                        </li>
                                        <li> 312 Chapter Test
                                        </li>
                                        <li> 312 Chapter Test
                                        </li>
                                        <li className="text-secondary"> 26More +</li>
                                    </ul>
                                    <div className="test-series-btn-group">
                                        <Link to="/jee/test-series" className="btn course-action-btn-white">View Details</Link>
                                        <Link to="#" className="btn course-action-btn-prime">Enroll now</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="test-series-card">
                                    <div className="test-series-card-top">
                                        <img src="/assets/img/course-logo.png" alt="#" className="img-fluid" />
                                        <p className="test-series-card-badge">₹1,800</p>
                                    </div>
                                    <h3 className="test-series-card-title">UP TGT Mock Test Series 2025</h3>
                                    <ul className="test-series-card-listing">
                                        <li> 4 Mega Live Test Marathon
                                        </li>
                                        <li> 10 Rapid Revision Mini Full Test
                                        </li>
                                        <li> 312 Chapter Test
                                        </li>
                                        <li> 312 Chapter Test
                                        </li>
                                        <li> 312 Chapter Test
                                        </li>
                                        <li className="text-secondary"> 26More +</li>
                                    </ul>
                                    <div className="test-series-btn-group">
                                        <Link to="/jee/test-series" className="btn course-action-btn-white">View Details</Link>
                                        <Link to="#" className="btn course-action-btn-prime">Enroll now</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}

export default TestSeries;
