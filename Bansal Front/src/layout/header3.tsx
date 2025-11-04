import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../store/auth/authStore";

const Header3 = () => {
    const { pathname } = useLocation()
    const isActive = (path: string) => pathname === path;
    const{logout} = useAuthStore()
    const navigate = useNavigate()
    const handelLogout = () => {
        logout()
       navigate("/")
    }
    useEffect(() => {
        const fixedBgHeader = document.querySelector('.header .navbar-collapse .fixed-bg-header');
        const navLinks = document.querySelectorAll('.header .nav-link , .header .nav-link-try');
        const togglerButton = document.querySelector('.navbar-toggler') as HTMLButtonElement;

        const handleTogglerClick = () => {
            if (togglerButton) togglerButton.click();
        };

        if (fixedBgHeader) {
            fixedBgHeader.addEventListener('click', handleTogglerClick);
        }

        navLinks.forEach((link) => {
            link.addEventListener('click', handleTogglerClick);
        });

        return () => {
            if (fixedBgHeader) {
                fixedBgHeader.removeEventListener('click', handleTogglerClick);
            }

            navLinks.forEach((link) => {
                link.removeEventListener('click', handleTogglerClick);
            });
        };
    }, []);

    return (
        <header>
            <div className="header header-fixed-top header-prime" id="Header">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <div className="container">
                        <Link className="navbar-brand header-logo" to="">
                            <img src="/assets/img/logo.png" alt="Logo" className="img-fluid" />
                        </Link>
                        <button className="navbar-toggler ms-auto collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <i className="fa-solid fa-bars header-toogle-prime"></i>
                            <i className="fa-solid fa-bars-staggered header-toogle-secondary"></i>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mx-auto center-header-list">
                                <li className="nav-item">
                                    <Link className={`nav-link ${isActive('/') ? 'active' : ''}`} aria-current="page" to="/" >Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${isActive('/courses') ? 'active' : ''}`} aria-current="page" to="/courses" >Courses</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${isActive('/test-series') ? 'active' : ''}`} aria-current="page" to="/test-series" >Test Series</Link>
                                </li>

                                {/* <li className="nav-item dropdown">
                                    <button className="nav-link dropdown-toggle" id="servicesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Courses <i className="fa-solid fa-angle-down" />
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="servicesDropdown">
                                        <li><Link className="dropdown-item" to="#">R logic</Link></li>
                                        <li><Link className="dropdown-item" to="#">T Track</Link></li>
                                        <li><Link className="dropdown-item" to="#">T Track</Link></li>
                                    </ul>
                                </li> */}
                                {/* <li className="nav-item dropdown">
                                    <button className="nav-link dropdown-toggle" id="servicesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Test Series <i className="fa-solid fa-angle-down" />
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="servicesDropdown">
                                        <li><Link className="dropdown-item" to="/test-series">Test Series 1</Link></li>
                                        <li><Link className="dropdown-item" to="/test-series">Test Series 2</Link></li>
                                        <li><Link className="dropdown-item" to="/test-series">Test Series 3</Link></li>
                                    </ul>
                                </li> */}
                                {/* <li className="nav-item dropdown">
                                    <button className="nav-link dropdown-toggle" id="servicesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Student Materiel <i className="fa-solid fa-angle-down" />
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="servicesDropdown">
                                        <li><Link className="dropdown-item" to="#">R logic</Link></li>
                                        <li><Link className="dropdown-item" to="#">T Track</Link></li>
                                        <li><Link className="dropdown-item" to="#">T Track</Link></li>
                                    </ul>
                                </li> */}
                                <li className="nav-item">
                                    <Link className="nav-link" to="/book-store">Book Store <img src="/assets/img/cart-icon.svg" alt="#" className="img-fluid" />
                                    </Link>
                                </li>
                                {/* <li className="nav-item d-block d-lg-none">
                                     <button className="header-cart-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#CartModal"><img src="/assets/img/carti.svg" alt="#" className="img-fluid" /> Cart(02)</button>
                                </li> */}
                            </ul>
                            </div>
                            <div className="">
                            <ul className="navbar-nav ms-2 ms-sm-4">
                                <li className="nav-item d-none d-lg-block">
                                    <Link to="tel:+91123456789" className="btn header-contact-btn">
                                        <i className="fa-solid fa-phone" />
                                        <div>
                                            <span>Talk To Our Expert</span>
                                            <p>+91 123456789</p>
                                        </div>
                                    </Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <button className="btn header-profile-btn dropdown-toggle" id="ProfileDrop" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src="/assets/img/profile.png" alt="#" className="img-fluid" /> <i className="fa-solid fa-angle-down" />
                                    </button>
                                    <ul className="dropdown-menu dashboard-lout-drop" aria-labelledby="ProfileDrop">
                                        <li><a 
                                        className="btn profile-logout-btn dropdown-item" 
                                        onClick={handelLogout} >
                                            <i className="fa-solid fa-arrow-right-from-bracket" /> Logout</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <div className="header-blank-space">
                <span />
            </div>
        </header>
    );
}

export default Header3;