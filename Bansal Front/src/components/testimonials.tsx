// import { useEffect } from "react";
// import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
// import "./ExploreCourses.css";
import Slider from "react-slick";
// import CarouselComponent from "./CarouselComponent";
// import { IMAGE_URL } from "../api/urls";
// const responsive = {
//   superLargeDesktop: {
//     breakpoint: { max: 4000, min: 1920 },
//     items: 5,
//   },
//   desktop: {
//     breakpoint: { max: 1920, min: 1024 },
//     items: 3,
//   },
//   tablet: {
//     breakpoint: { max: 1024, min: 464 },
//     items: 2,
//   },
//   mobile: {
//     breakpoint: { max: 464, min: 0 },
//     items: 1,
//   },
// };

const Testimonials = ({ testimonials }: any) => {
  const sliderSettings = {
  dots: false,
  arrows: false,
  infinite: testimonials.length > 1,
  // speed: 500,
  slidesToShow: 3.5,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 1500,
  // rtl: false,
  adaptiveHeight: false,
  responsive: [
    { breakpoint: 1920, settings: { slidesToShow: 4 } },
    { breakpoint: 1400, settings: { slidesToShow: 3 } },
    { breakpoint: 1200, settings: { slidesToShow: 2 } },
    { breakpoint: 576, settings: { slidesToShow: 1 } },

  ]
  // cssEase: 'linear'
};
  // useEffect(() => {
  //   // Equalize height of .h-100-equal cards after slider renders
  //   const equalizeHeights = () => {
  //     const items = document.querySelectorAll('.h-100-equal');
  //     let maxHeight = 0;
  //     items.forEach(item => {
  //       (item as HTMLElement).style.height = 'auto';
  //       maxHeight = Math.max(maxHeight, (item as HTMLElement).offsetHeight);
  //     });
  //     items.forEach(item => {
  //       (item as HTMLElement).style.height = `${maxHeight}px`;
  //     });
  //   };

  //   // Run after mount and when window resizes
  //   setTimeout(equalizeHeights, 100); // Wait for slider to render
  //   window.addEventListener('resize', equalizeHeights);
  //   return () => window.removeEventListener('resize', equalizeHeights);
  // }, []);
  return (
    <section className="overflow-hidden">
      <div className="testimonials-section">
        <div className="container">
          <h2 className="heading mb-4">
            Testimonials From Our <span>Students</span>
          </h2>
          <div className="testimonials-slider">
            <Slider {...sliderSettings} >
            {/* <Carousel
              responsive={responsive}
              swipeable={true}
              draggable={true}
              showDots={false}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={3000}
              keyBoardControl={true}
              customTransition="all 0.5s"
              transitionDuration={500}
              containerClass="carousel-container"
              removeArrowOnDeviceType={["tablet", "mobile"]}
              dotListClass="custom-dot-list-style"
              itemClass="carousel-item-padding-40-px"
            > */}
              {Array.isArray(testimonials) && testimonials.map((item: any) => (
                <div key={item.id} className="item">
                  <div className="testimonials-card ">
                    <div className="testimonial-quote-icon">
                      <i className="fa-solid fa-quote-left" />
                    </div>
                    <p className="testimonial-content">{item.description}</p>
                    <div className="tester-profile">
                      {/* <img 
                    src={item.image ? `${IMAGE_URL}${item.image}` : '/assets/img/no_image.jpg'}
                    alt={item.name} 
                    className="img-fluid" /> */}
                      <div className="tester-content">
                        <h3>{item.name}</h3>
                        <p>{item.subject}</p>
                      </div>
                    </div>
                  </div>
                </div>
                // </div>
              ))}
            {/* </Carousel> */}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
