import { Carousel } from "antd";
import Slider from "react-slick";
import { connect } from "react-redux";
import { useMediaQuery } from "react-responsive";
import React, { useEffect, useState } from "react";
import arrowLeft from "../../../../../assets/svg/arrowLeft.svg";
import arrowRight from "../../../../../assets/svg/arrowRight.svg";
import ProductCard from "../../../../../components/ProductCard/ProductCard";

export const TabCarousel = (props) => {
  // debugger;
  const [showSlider, setShowSlider] = useState(true);
  const isDesktop = useMediaQuery({ query: "(min-width: 767px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 430px)" });

  useEffect(() => {}, []);

  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <button
      {...props}
      className={
        "slick-prev slick-arrow" + (currentSlide === 0 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === 0 ? true : false}
      type="button"
    >
      <img src={arrowLeft} alt="" />
    </button>
  );
  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    <button
      {...props}
      className={
        "slick-next slick-arrow" +
        (currentSlide === slideCount - 1 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === slideCount - 1 ? true : false}
      type="button"
    >
      <img src={arrowRight} alt="" />
    </button>
  );

  const settings = {
    speed: 500,
    arrows: true,
    dots: false,
    autoplay: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplayspeed: 2000,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    // nextArrow: <img src={arrowRight} alt="" />,
    // prevArrow: <img src={arrowLeft} alt="" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          arrows: false,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
          arrows: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          arrows: false,
        },
      },
    ],
  };

  if (isMobile) {
    if (props.products.length > 2) {
      settings.infinite = true;
    }
  } else {
    if (props.products.length > 6) {
      settings.infinite = true;
    }
  }

  return (
    <>
      {showSlider ? (
        <Slider {...settings}>
          {props?.products?.length
            ? props?.products?.map((pro, key) => {
                return <ProductCard product={pro} key={key} />;
              })
            : null}
        </Slider>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TabCarousel);
