import React, { useState, useEffect } from "react";
import "./Carousel.css"; // Ensure you have responsive styles

interface CarouselProps {
  children: React.ReactNode;
  hideButton?: boolean;
  itemsToShow?: number;
  autoSlideInterval?: number;
}

const CarouselComponent: React.FC<CarouselProps> = ({
  children,
  itemsToShow = 3,
  hideButton = false,
  autoSlideInterval = 1500,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = React.Children.count(children);
  
  // Adjust items based on screen size
  const getResponsiveItemsToShow = () => {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return itemsToShow;
  };

  const [responsiveItemsToShow, setResponsiveItemsToShow] = useState(getResponsiveItemsToShow());

  useEffect(() => {
    const handleResize = () => {
      setResponsiveItemsToShow(getResponsiveItemsToShow());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
  };

  const goToPreviousSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
  };

  useEffect(() => {
    const interval = setInterval(goToNextSlide, autoSlideInterval);
    return () => clearInterval(interval);
  }, [autoSlideInterval]);

  return (
    <div className="carousel-container">
      {!hideButton && (
        <button className="carousel-button prev" onClick={goToPreviousSlide}>
          &#10094;
        </button>
      )}

      <div className="carousel-slide-container">
        <div
          className="carousel-slide"
          style={{
            transform: `translateX(-${(currentIndex * 100) / responsiveItemsToShow}%)`,
            transition: "transform 0.5s ease-in-out",
            width: '100%',
          }}
        >
          {React.Children.toArray(children).map((child, index) => (
            <div
              key={index}
              style={{
                width: `calc(100% / ${responsiveItemsToShow})`,
                flexShrink: 0,
                padding: "0 5px",
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {!hideButton && (
        <button className="carousel-button next" onClick={goToNextSlide}>
          &#10095;
        </button>
      )}
    </div>
  );
};

export default CarouselComponent;
