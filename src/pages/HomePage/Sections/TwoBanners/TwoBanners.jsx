import React from "react";
import { connect } from "react-redux";

import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import Banner1 from "../../../../assets/img/twoSectionBanner1.png";
import Banner2 from "../../../../assets/img/twoSectionBanner2.png";
import BannerMobile1 from "../../../../assets/img/twoSectionBannerMobile1.png";
import BannerMobile2 from "../../../../assets/img/twoSectionBannerMobile2.png";

export const TwoBanners = (props) => {
  const isDesktop = useMediaQuery({ query: "(min-width: 767px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 426px)" });
  return (
    <>
      <div className="home-two-banner-section">
        <div className="container-xl">
          <div className="two-banner-inner">
            <div className="home-two-banner left-section">
              <Link to={props?.data?.first_banner.link}>
                {isMobile ? (
                  <img
                    src={
                      props?.data?.first_banner
                        ? props.data.first_banner.mobile_img
                        : BannerMobile1
                    }
                    alt={props?.data?.first_banner?.banner_alt_text}
                  />
                ) : (
                  <img
                    src={
                      props?.data?.first_banner
                        ? props.data.first_banner.desktop_img
                        : Banner1
                    }
                    alt={props?.data?.first_banner?.banner_alt_text}
                  />
                )}
              </Link>
            </div>
            <div className="home-two-banner right-section">
              <Link to={props.data.second_banner.link}>
                {isMobile ? (
                  <img
                    src={
                      props.data.second_banner
                        ? props.data.second_banner.mobile_img
                        : BannerMobile2
                    }
                    alt={props?.data?.second_banner?.banner_alt_text}
                  />
                ) : (
                  <img
                    src={
                      props.data.second_banner
                        ? props.data.second_banner.desktop_img
                        : Banner2
                    }
                    alt={props?.data?.second_banner?.banner_alt_text}
                  />
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TwoBanners);
