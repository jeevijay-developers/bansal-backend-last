import { Link } from "react-router-dom";
import AppDownload from "../components/app-download";
import Faqs from "../components/faqs";
import Testimonials from "../components/testimonials";
import Slider from "react-slick";
// import { useState } from "react";
import OurCourses from "../components/OurCourses";
import OurTestSeries from "../components/OurTestSeries";
import { useEffect, useRef, useState } from "react";
import AOS from "aos";

// import TestSeries from "../components/test-series";
import { useAuthStore } from "../store/auth/authStore";
import { APIPATH, IMAGE_URL } from "../api/urls";
import { postApi } from "../services/services";
import LoaderWithBackground from "../components/LoaderWithBackground";
// import { Carousel } from "react-bootstrap";

// import SearchCity from "../components/searchcity";
// import { useState } from "react";
// const ResultsSlides = [
//     "/assets/img/result.png",
//     "/assets/img/result.png",
// ]
const settings = {
  dots: false,
  arrows: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 1500,
  // className: "hero-slider",
};
const Home = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const { token, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [homeData, setHomeData] = useState<any>("");
  // const{pathname} = useLocation()
  useEffect(() => {
    AOS.init();
    getHomeData();
    const video = videoRef.current;
    const playButton = playButtonRef.current;
    if (!video || !playButton) return;
    video.controls = false;
    const handlePlay = () => {
      video.play();
      video.controls = true;
      playButton.style.display = "none";
    };
    const handleEnded = () => {
      playButton.style.display = "block";
      video.controls = false;
    };
    playButton.addEventListener("click", handlePlay);
    video.addEventListener("ended", handleEnded);
    return () => {
      playButton.removeEventListener("click", handlePlay);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);
  useEffect(() => {
    // Equalize height of .h-100-equal cards after slider renders
    const equalizeHeights = () => {
      const items = document.querySelectorAll(".h-100-equal");
      let maxHeight = 0;
      items.forEach((item) => {
        (item as HTMLElement).style.height = "auto";
        maxHeight = Math.max(maxHeight, (item as HTMLElement).offsetHeight);
      });
      items.forEach((item) => {
        (item as HTMLElement).style.height = `${maxHeight}px`;
      });
    };

    // Run after mount and when window resizes
    setTimeout(equalizeHeights, 100); // Wait for slider to render
    window.addEventListener("resize", equalizeHeights);
    return () => window.removeEventListener("resize", equalizeHeights);
  }, []);
  const getHomeData = () => {
    setLoading(true);
    postApi(APIPATH.home, {}, token, logout)
      .then((resp) => {
        // console.log(resp, "resprespresp");
        const { data } = resp;
        setHomeData(data);
        // console.log(homeData, 'fvbsdfgfdg')
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <LoaderWithBackground visible={loading} />
      <section className="overflow-hidden">
        <div className="hero-section" data-aos="zoom-in-down">
          <div className="container">
            <div className="hero-main-card">
              <div className="row align-items-center justify-content-between">
                <div className="col-lg-5 col-xl-6 mb-4 mb-lg-0">
                  <h1 className="hero-heading">
                    Bansal Smart - Learn Online Or Offline,{" "}
                    <span> Your Way</span>
                  </h1>
                  <p className="hero-badge-text">
                    Offline Courses for{" "}
                    <span>JEE I NEET I 8-10 Foundation</span>
                  </p>
                  <div className="hero-btn-group">
                    <Link
                      to="/courses"
                      type="button"
                      className="btn hero-main-btn-dark"
                    >
                      View Course <i className="fa-solid fa-arrow-right" />
                    </Link>
                   
                  </div>
                </div>
                <div className="col-lg-7 col-xl-6">
                  {/* <div className="hero-slider"> */}
                  <Slider {...settings}>
                    {homeData?.banners &&
                      homeData?.banners
                        .filter(
                          (b: { position: string }) => b.position == "top"
                        )
                        .map((slide: any, index: any) => (
                          <div className="item" key={index}>
                            <div className="hero-slider-card">
                              <div className="row align-items-end">
                                {/* <div className="col-md-7 col-xl-6">
                                                            <h2 className="hero-slider-heading">{slide.title}</h2>
                                                            <ul className="hero-slider-list">
                                                                {["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate.",
                                                                    "Lorem ipsum dolor sit amet, consectetur",
                                                                    ,].map((item, idx) => (
                                                                        <li key={idx}>{item}</li>
                                                                    ))}
                                                            </ul>
                                                            <button type="button" className="btn hero-slider-action">
                                                                Download For Free
                                                            </button>
                                                        </div> */}
                                <div className="col-12 col-sm-12 col-xl-12 mx-auto">
                                  <img
                                    style={{
                                      height: "300px",
                                      width: "100%",
                                      objectFit: "cover",
                                    }}
                                    src={
                                      slide.banner
                                        ? `${IMAGE_URL}${slide.banner}`
                                        : `/assets/img/no_image.jpg`
                                    }
                                    alt={slide.title}
                                    className="img-fluid"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                  </Slider>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="overflow-hidden">
        <div className="container">
          <div className="ideal-course-section">
            <h2 className="heading mb-4">
              Explore The Ideal Online <span> Course For You!</span>
            </h2>
            <div className="row">
              {homeData?.categories
                ?.filter(
                  (cat: { courses: string | any[] }) => cat.courses.length > 0
                )
                .slice(0, 3)
                .map((category: any, index: number) => (
                  <div className="col-md-4 mb-4 mb-md-0" key={index}>
                    <div className="ideal-course-card" data-aos="flip-right">
                      <h3 className="ideal-course-title">
                        {category.category_name}
                      </h3>
                      <div className="ideal-course-card-footer">
                        <Link
                          to="/courses"
                          state={{ selectedCategory: category.slug }}
                        >
                          {/* <Link to={{ pathname: "/courses", state: { selectedCategory: category.slug } }}> */}
                          View <i className="fa-solid fa-arrow-right" />
                        </Link>

                        <img
                          // style={{borderRadius: "50%", width: "100px", height:"100px"}}
                          // src={category.courses[0]?.image ? `${IMAGE_URL}${category.courses[0].image}` : '/assets/img/no_image.jpg'}
                          src="/assets/img/online-course-1.png"
                          alt={`${category.category_name} course`}
                          className="ideal-course-img"
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <Link
              style={{ marginTop: "20px" }}
              to="/courses"
              className="btn btn-primery mx-auto d-block w-fit-content"
            >
              View All
            </Link>
          </div>
        </div>
      </section>
      <section className="overflow-hidden">
        <div className="learning-material-bg">
          <div className="container">
            <div className="learning-material-section">
              <h2 className="heading mb-4">
                Boost Your Prep With <span> Free Learning Materials</span>
              </h2>
              <div className="row">
                <div className="col-md-4 mb-4 mb-md-0">
                  <div className="learning-material-card" data-aos="flip-up">
                    <div className="learning-material-top">
                      <img
                        src="/assets/img/Frame-23.png"
                        alt="#"
                        className="img-fluid"
                      />
                      {/* <a href='#'><i className="fa-solid fa-arrow-right" /></a> */}
                    </div>
                    <h3 className="learning-material-title">
                      Mock Tests - JEE &amp; NEET
                    </h3>
                  </div>
                </div>
                <div className="col-md-4 mb-4 mb-md-0">
                  <div className="learning-material-card" data-aos="flip-up">
                    <div className="learning-material-top">
                      <img
                        src="/assets/img/Frame-23.png"
                        alt="#"
                        className="img-fluid"
                      />
                      {/* <a href='#'><i className="fa-solid fa-arrow-right" /></a> */}
                    </div>
                    <h3 className="learning-material-title">
                      NEET Complete Study Guide
                    </h3>
                  </div>
                </div>
                <div className="col-md-4 mb-4 mb-md-0">
                  <div className="learning-material-card" data-aos="flip-up">
                    <div className="learning-material-top">
                      <img
                        src="/assets/img/Frame-23.png"
                        alt="#"
                        className="img-fluid"
                      />
                      {/* <a href='#'><i className="fa-solid fa-arrow-right" /></a> */}
                    </div>
                    <h3 className="learning-material-title">
                      JEE Advanced Complete Study Guide
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="overflow-hidden">
        <div className="why-choose-section">
          <div className="container">
            <div className="row align-items-center justify-content-between mb-4">
              <div
                className="col-md-7 col-xl-6 mb-4"
                data-aos="fade-down-right"
              >
                <h2 className="heading mb-4">
                  Why <span> Bansal Smart</span>
                </h2>
                <h3 className="why-choose-heading">
                  Achieve Your Best with Dedicated Personal Guidance
                </h3>
                <p className="why-choose-content">
                  At <span> Bansal Smart</span>, We Ensure Unmatched Personal
                  Attention Through Our <span> Dedicated Educators</span> And
                  Smart Tech-Driven Systems.
                </p>
                <a href="#" className="btn btn-primery">
                  Read More <i className="fa-solid fa-arrow-right" />
                </a>
              </div>
              <div className="col-md-5 col-xl-6 mb-4" data-aos="fade-down-left">
                <img
                  src="/assets/img/why-choose.png"
                  alt="#"
                  className="img-fluid"
                />
              </div>
            </div>
            <div className="why-choose-bottom" data-aos="fade-up">
              <div className="row">
                <div className="col-lg-3 col-sm-6 mb-4 mb-lg-0">
                  <div className="why-choose-bottom-card">
                    <img
                      src="/assets/img/live-stream.png"
                      alt="#"
                      className="img-fluid"
                    />
                    <h3 className="why-choose-bottom-title">Daily Live</h3>
                    <p className="why-choose-bottom-pera">
                      Interactive Sessions
                    </p>
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 mb-4 mb-lg-0">
                  <div className="why-choose-bottom-card">
                    <img
                      src="/assets/img/contract.png"
                      alt="#"
                      className="img-fluid"
                    />
                    <h3 className="why-choose-bottom-title">10 Million +</h3>
                    <p className="why-choose-bottom-pera">
                      Tests, sample papers &amp; notes
                    </p>
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 mb-4 mb-sm-0">
                  <div className="why-choose-bottom-card">
                    <img
                      src="/assets/img/question.png"
                      alt="#"
                      className="img-fluid"
                    />
                    <h3 className="why-choose-bottom-title">24 x 7</h3>
                    <p className="why-choose-bottom-pera">
                      Interactive Sessions
                    </p>
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6">
                  <div className="why-choose-bottom-card">
                    <img
                      src="/assets/img/skyscraper.png"
                      alt="#"
                      className="img-fluid"
                    />
                    <h3 className="why-choose-bottom-title">100+</h3>
                    <p className="why-choose-bottom-pera">Offline centers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {homeData?.categories?.length > 0 && (
        <OurCourses coursesFilter={homeData?.categories || []} />
      )}
        {homeData?.categories?.length > 0 && (
        <OurTestSeries coursesFilter={homeData?.categories || []} />
      )}
      <section className="overflow-hidden">
        <div className="course-offer-plan">
          <div className="container">
            <h2 className="course-offer-heading">
              JEE Nurture Online Course | <a href="#"> Get 50% Off Buy Now</a>
            </h2>
          </div>
        </div>

        <div className="city-center-section">
          <div className="container">
            <h2 className="heading text-white text-center mb-4 pb-4">
              Discover Tech-Driven Education at Bansal Smart Offline Center.
            </h2>

            <div className="city-center-card" data-aos="zoom-out">
              <h3 className="heading text-center mb-4">
                We're Now in Your City - Visit Our <span> Nearest Centre!</span>
              </h3>
              {/* {homeData?.servicableCities > 0 && (
                                <> */}
              <div className="row">
                {homeData?.servicableCities
                  ?.filter((c: any) => c.total_centers !== 0)
                  .slice(0, 8)
                  .map((city: any) => (
                    <div
                      className="col-sm-6 col-lg-4 col-xxl-3 mb-4"
                      key={city.id}
                    >
                      {/* <Link 
                                        to={`/centers/${city.slug}`} 
                                        className="text-decoration-none city-hover-ef"> */}
                      <Link
                        state={{ selectedCity: city.slug }}
                        to={`/centers`}
                        className="text-decoration-none city-hover-ef"
                      >
                        <div className="city-card">
                          <img
                            src={
                              city.image
                                ? `${IMAGE_URL}${city.image}`
                                : "/assets/img/no_image.jpg"
                            }
                            // src={`/assets/img/image.png`}
                            alt={city.title}
                            className="img-fluid"
                          />
                          <h4 className="city-name">{city.title}</h4>
                        </div>
                      </Link>
                    </div>
                  ))}
              </div>
              <Link
                to="/centers"
                className="btn btn-primery mx-auto d-block w-fit-content"
              >
                View All
              </Link>
              {/* </>
                            )} */}

              {/* <button
                                type="button"
                                className="btn btn-primery mx-auto d-block w-fit-content"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasRight"
                                // onClick={() => setShowSidebar(true)}
                                aria-controls="offcanvasRight"
                            >
                                View All
                            </button> */}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden">
        <div className="our-video-section">
          <div className="container">
            <div className="row align-items-center justify-content-between">
              <div className="col-md-5 mb-4 mb-md-0" data-aos="flip-right">
                <div className="our-video">
                  <video
                    className="img-fluid d-block"
                    id="OurVideo"
                    poster="/assets/img/Frame-82.png"
                    ref={videoRef}
                  >
                    <source src="/assets/video/mov_bbb.mp4" type="video/mp4" />
                  </video>
                  <button
                    type="button"
                    className="video-play-button"
                    ref={playButtonRef}
                  >
                    <i className="fa-solid fa-circle-play" /> Inside View
                  </button>
                </div>
              </div>
              <div className="col-md-6" data-aos="flip-left">
                <h2 className="heading mb-4">
                  Discover Learning Like Never Before – Interactive Classes
                  &amp; Guided <span> Tours Available</span>.
                </h2>
                <ul className="our-video-list">
                  <li>
                    Get Personalized Guidance and Course Recommendations with a
                    FREE Counseling Session.
                  </li>
                  <li>
                    Attend FREE Demo Classes Conducted by Top Master Teachers.
                  </li>
                  <li>Unlock Exclusive Offers – Visit Us Today!</li>
                </ul>
                <Link to="/contact" className="btn btn-primery">
                  Contact Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <TestSeries /> */}
      <AppDownload />
      {homeData?.banners?.some(
        (b: { position: string }) => b.position === "bottom"
      ) && (
        <section className="overflow-hidden">
          <div className="results-section">
            <div className="container">
              <div className="top-results-card">
                <h2 className="heading mb-4">
                  Our Outstanding <span>Results</span>
                </h2>
                <div className="top-results-img-slider">
                  <Slider {...settings}>
                    {homeData?.banners
                      ?.filter(
                        (b: { position: string }) => b.position === "bottom"
                      )
                      .map((result: any) => (
                        <div key={result.id} className="item">
                          <img
                            src={`${IMAGE_URL}${result.banner}`}
                            style={{
                              height: "300px",
                              width: "100%",
                              objectFit: "cover",
                            }}
                            alt={result?.title}
                            className="img-fluid"
                          />
                        </div>
                      ))}
                  </Slider>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Testimonials testimonials={homeData?.testimonials || []} />
      <Faqs faqs={homeData?.faqs || []} />
    </>
  );
};

export default Home;
