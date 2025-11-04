import { useEffect } from "react";
import { Link } from "react-router-dom";

const TestLive: React.FC = () => {
  useEffect(() => {
    const button = document.getElementById("MenuCBtn");
    const rightMenu = document.getElementById("Rightmenu");

    if (!button || !rightMenu) return;

    const icon = button.querySelector("i");

    const toggleMenu = () => {
      rightMenu.classList.toggle("active");

      if (icon) {
        if (rightMenu.classList.contains("active")) {
          // icon.classList.remove("fa-xmark");
          // icon.classList.add("fa-bars");
        } else {
          // icon.classList.remove("fa-bars");
          // icon.classList.add("fa-xmark");
        }
      }
    };

    button.addEventListener("click", toggleMenu);

    return () => {
      button.removeEventListener("click", toggleMenu);
    };
  }, []);

  return (
    <section className="overflow-hidden">
      <div className="test-page-header">
        <div className="container-fluid test-page-container">
          <div className="live-test-header">
            <Link className="navbar-brand order-1" to="/dashboard">
              <img src="/assets/img/logo.png" alt="logo" className="img-fluid" />
            </Link>
            <div className="live-test-progress order-3 order-sm-2">
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: "20%" }}
                  aria-valuenow={20}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
            <div className="order-2 order-sm-3">
              <button type="button" className="test-menu-close-btn" id="MenuCBtn">
                  <i className="fa-solid fa-bars" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="test-info-page test-live-submit-page">
        {/* Left Section */}
        <div className="livetest-left-menu">
          <div className="livetest-top-header">
            <p>Question 1.</p>
            <span>
              <i className="fa-regular fa-flag" /> Repost
            </span>
          </div>
          <div className="questions-card">
            <h3 className="question-heading">
              Q1. What is the mechanism through which cells differentiate in multicellular organisms?
            </h3>
            <div className="questions-ans-submit">
              {["A", "B", "C", "D"].map((label, index) => (
                <div key={index}>
                  <input
                    type="radio"
                    className="btn-check"
                    name="options-outlined"
                    id={`option-${index}`}
                    autoComplete="off"
                    defaultChecked={index === 0}
                  />
                  <label className="btn btn-outline-success" htmlFor={`option-${index}`}>
                    <span>{label}</span> Those responsible for an action that may be catastrophic must prove that it
                    will not harm before proceeding.
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="live-test-footer">
            <div className="questions-count">
              <h2 className="qcount-heading">Question 1 Of 30</h2>
              <p className="time-period-count">53 Minutes 35 Seconds</p>
            </div>
            <div className="qsec-btns-group">
              <button className="question-action-btn me-3">Mark & Next</button>
              <button className="text-right-btm-btn">Save And Next</button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="live-test-right-menu" id="Rightmenu">
          <div className="live-test-menu-head">
              {/* <div className="lt-menu-user-img">
                <img src="/assets/img/profile-img.png" alt="user" className="img-fluid" />
              </div> */}
              <p className="user-name mb-0">Candidate Info</p>
              
            </div>
          <div className="live-test-right-scroll">
            

            <div className="marking-suggest">
              {[
                ["answered-mark", "01", "Answered"],
                ["marked-mark", "02", "Marked"],
                ["not-visited-mark", "03", "Not Visited"],
                ["not-answered-mark", "05", "Not Answered"],
                ["marked-answered-mark", "04", "Marked and Answered"],
              ].map(([className, num, label], idx) => (
                <div className="mark-sug-group" key={idx}>
                  <button className={className}>{num}</button>
                  <p className="mb-0 text text-dark">{label}</p>
                </div>
              ))}
            </div>

            <div className="test-section-card">
              <h3>
                Section: <span>test</span>
              </h3>
              <div className="total-questions-aligns">
                {Array.from({ length: 30 }, (_, i) => (
                  <button key={i} className="answered-mark empty">
                    {String(i + 1).padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="side-menu-footer">
            <Link to="/test/result" className="side-footer-menu-btn">
              Submit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestLive;
