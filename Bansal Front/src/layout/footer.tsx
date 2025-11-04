import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Footer = () => {
  const [contactData, setContactData] = useState({
    email: '',
    mobile: '',
    address: '',
    instagram: '#',
    facebook: '#',
    linkedin: '#',
    youtube: '#'
  });

  useEffect(() => {
    AOS.init();
    fetchFooterData();
  }, []);

const fetchFooterData = async () => {
  try {
    const response = await fetch("https://project.bansalcalssadmin.aamoditsolutions.com/api/v1/contact-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      console.error("HTTP error!", response.status);
      return;
    }

    const result = await response.json();

    if (result.success && result.data) {
      setContactData(result.data);
    } else {
      console.error("API responded with failure:", result);
    }
  } catch (error) {
    console.error("Network or parsing error:", error);
  }
};

  return (
    <footer className="overflow-hidden">
      <div className="footer" data-aos="fade-up">
        <div className="footer-section">
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-md-3 col-sm-4 mb-3 order-1 order-sm-1">
                <Link to='/'>
                  <img src="/assets/img/logo.png" alt="#" className="footer-logo" />
                </Link>
                <h2 className="footer-follow-heading">Follow Us: </h2>
                <div className="footer-socials">
                  <a href={contactData.facebook} className="footer-social-link"><i className="fa-brands fa-facebook" /></a>
                  <a href={contactData.instagram} className="footer-social-link"><i className="fa-brands fa-square-instagram" /></a>
                  <a href={contactData.linkedin} className="footer-social-link"><i className="fa-brands fa-linkedin" /></a>
                </div>
              </div>

              <div className="col-xl-2 col-md-2 col-sm-4 col-5 mb-3  order-3 order-sm-2">
                <h2 className="footer-heading">Company</h2>
                <ul className="footer-links-nav">
                  <li><Link to="/courses" className="footer-link">Courses</Link></li>
                  <li><Link to="/centers" className="footer-link">Offline Centers</Link></li>
                  <li><Link to="/about" className="footer-link">About Us</Link></li>
                  <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
                  <li><Link to="/blogs" className="footer-link">Blog</Link></li>
                </ul>
              </div>

              <div className="col-xl-3 col-md-3 col-sm-4 col-7 mb-3 mb-mob-40 order-4 order-sm-3">
                <h2 className="footer-heading">Quick link</h2>
                <ul className="footer-links-nav">
                  <li><Link to="/terms-conditions" className="footer-link">Terms and Conditions</Link></li>
                  <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
                  <li><Link to="/notice-collection" className="footer-link">Notice of Collection</Link></li>
                </ul>
              </div>

              <div className="col-xl-3 col-md-4 col-sm-12 mb-3  mb-mob-40 order-2 order-sm-4">
                <h2 className="footer-heading">Stay Connected</h2>
                <ul className="footer-links-nav">
                  <li><p className="footer-link-address">{contactData.address}</p></li>
                  <li><a href={`tel:${contactData.mobile}`} className="footer-right-link"><i className="fa-solid fa-phone" /> {contactData.mobile}</a></li>
                  <li><a href={`mailto:${contactData.email}`} className="footer-right-link"><i className="fa-solid fa-envelope" /> {contactData.email}</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="copyright-section">
          <div className="container">
            <p className="text text-center mb-0">Copyright © 2025 <Link to="/" className="text-decoration-none text-dark"><b>Bansal Smart</b></Link>, All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
