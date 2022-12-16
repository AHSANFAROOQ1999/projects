import React from "react";
import { connect } from "react-redux";
import badge1 from "../../../../assets/svg/badge1.svg";

export const FeaturedIcons = (props) => {
  return (
    <>
      <div className="homepage-badge-section">
        <div className="container-xl">
          <div className="badges-section">
            {props.data?.features
              ? props.data?.features?.map((badge, index) => {
                  return (
                    <div className="badge" key={index}>
                      <div className="badge-icon">
                        <img
                          src={badge.icon_img ? badge.icon_img : badge1}
                          alt={badge.title}
                        />
                      </div>
                      <div className="badge-details">
                        <p className="para-dark">{badge.title}</p>
                        {/* <p className="para-lite">{ badge.small_text }</p> */}
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(FeaturedIcons);
