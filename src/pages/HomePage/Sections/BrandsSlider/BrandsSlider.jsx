import React from "react";
import { Carousel } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import arrowLeft from "../../../../assets/svg/arrowLeft.svg";
import arrowRight from "../../../../assets/svg/arrowRight.svg";

export const BrandsSlider = (props) => {
  const settings = {
    arrows: true,
    dots:false,
    autoplay: true,
    slidesToShow: 7,
    // prevArrow: <img src={arrowLeft} alt="Left Arrow" />,
    // nextArrow: <img src={arrowRight} alt="Right Arrow" />,
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
          rows: 2,
        },
      },
    ],
  };

  return (
    <>
      <div className="home-brand-section">
        <div className="container-xl">
          <div className="brands-slider-inner">
            <h3 className="section-title">
              {props.data.title ? props.data.title : null}
            </h3>
            <div className="brand-slider-wrapper">
              <Carousel {...settings}>
                {props.data.brands.map((brand, key) => {
                  return (
                    <div className="brand-card-wrapper" key={key}>
                      <Link to={"/brand/" + brand.handle}>
                        <img
                          className="product-img"
                          src={brand.logo ? brand.logo : null}
                          alt={brand.name}
                        />
                      </Link>
                    </div>
                  );
                })}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BrandsSlider);
