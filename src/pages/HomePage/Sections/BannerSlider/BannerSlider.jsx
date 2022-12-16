import React from "react";
import { connect } from "react-redux";
import { Carousel } from "antd";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

export const BannerSlider = (props) => {
  const isDesktop = useMediaQuery({ query: "(min-width: 767px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 426px)" });

  // const contentStyle = {
  //   height: "160px",
  //   color: "#fff",
  //   lineHeight: "160px",
  //   textAlign: "center",
  //   background: "#364d79",
  // };

  return (
    <>
      <div className="homepage-slider">
        {isMobile ? (
          <>
            {/* Mobile View Slider  📲  */}

            <Carousel effect="fade" autoplay={true} dots={false}>
              {props?.data?.slides?.map((banner, key) => {
                return (
                  <div key={key}>
                    <Link to={banner.link}>
                      <img
                        className="slider-image"
                        src={banner.mobile_img}
                        alt={banner.banner_slider_alt_text}
                      />
                    </Link>
                  </div>
                );
              })}
            </Carousel>
          </>
        ) : (
          <>
            {/* WebView Slider  🖥 */}

            <Carousel effect="fade" autoplay={true} dots={false}>
              {props?.data?.slides?.map((banner, key) => {
                return (
                  <div key={key}>
                    <Link to={banner.link}>
                      <img
                        className="slider-image"
                        src={banner.desktop_img}
                        alt={banner.banner_slider_alt_text}
                      />
                    </Link>
                  </div>
                );
              })}
            </Carousel>
          </>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BannerSlider);
