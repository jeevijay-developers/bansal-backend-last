import { Link, useLocation, useNavigate } from "react-router-dom";
import { useModal } from "../components/ModalContext";
import { useEffect } from "react";
import { useAuthStore } from "../store/auth/authStore";
import { toast } from "react-toastify";
// import LoginModal from "../components/login";
// import OTPModal from "../components/otp";
// import Register from "../components/register";

const Header = () => {
    const { pathname } = useLocation();
    const isActive = (path: string) => pathname === path;
    const { logout, isLogin } = useAuthStore();
    const navigate = useNavigate();
    // const [showLogin, setShowLogin] = useState(false);
    // const [phone, setPhone] = useState<string>('');
    // const [showOTP, setShowOTP] = useState(false);
    // const [showRegister, setShowRegister] = useState(false);

    // const openLogin = () => {
    //     setShowOTP(false);
    //     setShowRegister(false);
    //     setShowLogin(true);
    // };
    // const handleRequestOTP = (phone: string) => {
    //     openOTP(phone);
    // };

    // const openOTP = (phone: string) => {
    //     setPhone(phone);
    //     setShowLogin(false);
    //     setShowRegister(false);
    //     setShowOTP(true);
    // };
    //    const openRegister = () => {
    //     setShowLogin(false);
    //     setShowOTP(false);
    //     setShowRegister(true);
    //   };
    const { openLogin } = useModal();
    const cartRoutes = ["/book-store", "/books", "/checkout", "/book/details"];

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
    const handleLogout = () => {
        toast.info("logout Seccessfuly")
        logout();
    };
    console.log(isLogin, 'login')
    return (
        <header>
      {/* <Register onRequestOTP= {handleRequestOTP}/> */}
            <div className="header header-fixed-top header-prime" id="Header">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <div className="container">
                        <Link className="navbar-brand header-logo" to="/">
                            <img src="/assets/img/logo.png" alt="Logo" className="img-fluid" />
                        </Link>
                        <button className="navbar-toggler ms-auto collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <i className="fa-solid fa-bars header-toogle-prime"></i>
                            <i className="fa-solid fa-bars-staggered header-toogle-secondary"></i>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <span className="fixed-bg-header"></span>
                            <ul className="navbar-nav mx-auto center-header-list">
                                <li className="nav-item">
                                    <Link className={`nav-link ${isActive('/') ? 'active' : ''}`} to="/" >Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${isActive('/courses') ? 'active' : ''}`} to="/courses" >Courses</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${isActive('/test-series') ? 'active' : ''}`} to="/test-series" >Test Series</Link>
                                </li>

                                 <li className="nav-item">
                                    <Link className={`nav-link ${isActive('/live-test') ? 'active' : ''}`} to="/live-test" >Live Test</Link>
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
                                    <Link className={`nav-link ${isActive('/book-store') ? 'active' : ''}`} to="/book-store">Book Store <img src="/assets/img/cart-icon.svg" alt="#" className="img-fluid" /></Link>
                                </li>
                            </ul>
                        </div>

                        <div className="">

                            <ul className="navbar-nav ms-2 ms-sm-4">
                                {cartRoutes.some(route => isActive(route)) && (
                                    <li className="nav-item d-none d-lg-block">
                                        <button className="header-cart-btn nav-link-try" type="button" data-bs-toggle="offcanvas" data-bs-target="#CartModal">
                                            <img src="/assets/img/carti.svg" alt="#" className="img-fluid" /> Cart</button>
                                    </li>

                                )}
                                {isLogin ? (
                                    <>
                                        <li className="nav-item">
                                            <button
                                                className="btn header-btn"
                                                style={{ marginRight: "20px" }}
                                                onClick={() => navigate("/dashboard")}>
                                                Dashboard
                                            </button>

                                        </li>
                                        <li className="nav-item">
                                            <button className="btn header-btn" onClick={handleLogout}>
                                                Logout
                                            </button>

                                        </li>

                                    </>

                                ) : (
                                    <li className="nav-item">
                                        <button className="btn header-btn" onClick={openLogin}>
                                            Login
                                        </button>
                                        {/* {showLogin && (
                                            <LoginModal
                                                show={showLogin}
                                                onClose={() => setShowLogin(false)}
                                                onRequestOTP={handleRequestOTP}
                                            />
                                        )}

                                        {showOTP && (
                                            <OTPModal
                                                show={showOTP}
                                                onClose={() => setShowOTP(false)}
                                                phone={phone}
                                            />
                                        )} */}

                                    </li>
                                )}
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

export default Header;


