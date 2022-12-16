import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import pageBanner from "../../assets/img/pageBanner.png";
import "./PageBanner.scss";

export const PageBanner = (props) => {
  // console.log("PageBanner Props: ", props);

  const firstRender = useRef(true);
  const [bannerLink, setBannerLink] = useState("");
  const [seoDetials, setSeoDetials] = useState("");

  useEffect(() => {
    firstRender.current = false;
    if (firstRender) {
      fetchBanner();
    }
  }, [props?.handle, props?.productsFrom]);

  const fetchBanner = () => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_HOST +
          "/storefront/productlistbanner?" +
          props?.productsFrom +
          "=" +
          props?.handle
      )
      .then((response) => {
        // console.log("product list banner", response);

        setBannerLink(response.data.cdn_link);
        setSeoDetials(response.data.seo_details);
      })
      .catch((err) => {
        // console.log(err);
        setBannerLink(null);
      });
  };
  return (
    <>
      <div className="page-banner">
        <Helmet>
          <title>
            {seoDetials?.seo_title
              ? seoDetials?.seo_title + " | COMVERSE"
              : seoDetials?.title
              ? seoDetials?.title + " | COMVERSE"
              : "COMVERSE | Redefining Commerse"}
          </title>
          <meta name="description" content={seoDetials?.seo_description} />
          <meta name="keyword" content={seoDetials?.seo_keywords} />
        </Helmet>
        {bannerLink ? (
          <>
            <img
              src={bannerLink ? bannerLink : pageBanner}
              alt={seoDetials?.title}
            />

            {/* <div className="banner-content-wrapper"> */}
            {/* <h1 className="banner-heading">{heading[0]} <span>{ bannerTitle.replace(heading[0], '') }</span></h1> */}
            {/* <p className="banner-para">{  } </p> */}
            {/* </div> */}
          </>
        ) : null}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PageBanner);
