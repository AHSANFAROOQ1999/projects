import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import staticBanner from "../../../../assets/img/staticBanner.png";
import staticBannerMobile from "../../../../assets/img/staticBannerMobile.png";

export const SingleBanner = (props) => {
  const isDesktop = useMediaQuery({ query: "(min-width: 767px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 426px)" });
  return (
    <>
      <div className="homepage-static-banner single-banner">
        {props.data.desktop_img ? (
          <Link to={props.data.link}>
            {isMobile ? (
              <img
                src={
                  props.data.mobile_img
                    ? props.data.mobile_img
                    : staticBannerMobile
                }
                alt={props.data?.single_banner_text_alt}
                className="mobile-banner"
              />
            ) : (
              <img
                src={
                  props.data.desktop_img ? props.data.desktop_img : staticBanner
                }
                alt={props.data?.single_banner_text_alt}
                className="desktop-banner"
              />
            )}
          </Link>
        ) : null}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SingleBanner);
