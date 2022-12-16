import React from "react";
import "./AnnouncementBar.scss";
import { useMediaQuery } from "react-responsive";
import { PhoneFilled } from "@ant-design/icons";
import ReactFlagsSelect from "react-flags-select";
import { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  changeCountry,
  changeCountryCode,
  changeCurrency,
} from "../../redux/slices/multiLocationSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import { clearCheckout } from "../../redux/slices/checkoutSlice";

export const AnnouncementBar = (props) => {

  console.log("AnnouncementBar Props", props);
  const dispatch = useDispatch();
  const selectedCountry = useSelector(
    (state) => state.multiLocation.defaultCountryCode
  );

  const isDesktop = useMediaQuery({ query: "(min-width: 767px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 430px)" });

  const countries = props?.announcementHeader?.country_list?.map(
    (country) => country?.short_code
  );

  const location = (code) => {
    // debugger;
    let country = props?.announcementHeader?.country_list.find(
      (country) => country.short_code == code
    );

    dispatch(changeCountry(country?.country_name));
    dispatch(changeCountryCode(code));
    dispatch(changeCurrency(country?.currency));
    dispatch(clearCart());
    dispatch(clearCheckout());
    localStorage.removeItem("cart");
    localStorage.removeItem("wishList");
  };

  useEffect(() => {}, [props, selectedCountry]);

  return (
    <>
      {props?.announcementHeader?.announcement_bar?.enable ? (
        <>
          <div
            style={{
              backgroundColor: props?.announcementHeader?.announcement_bar
                ? props?.announcementHeader?.announcement_bar?.background_color
                : null,
            }}
            className={
              isMobile
                ? "accouncement-bar announcement-mobile"
                : "accouncement-bar announcement-desktop"
            }
          >
            <div className="container-xl">
              <div className="k-row">
                {isMobile ? null : (
                  <div className="announcement-contact flex--1">
                    <div className="k-row">
                      <PhoneFilled />

                      <p className="k-row2">
                        {props?.announcementHeader?.announcement_bar
                          ? props.announcementHeader?.announcement_bar
                              .phone_number
                          : null}
                      </p>
                    </div>
                  </div>
                )}
                <div className="announcement-text">
                  <h1>
                    {props?.announcementHeader?.announcement_bar
                      ? props?.announcementHeader?.announcement_bar
                          .announcement_text
                      : null}
                  </h1>
                </div>
                {isMobile ? null : (
                  <div className="lang-picker-wrap flex--1">
                    <div className="k-row lang-picker">
                      <ReactFlagsSelect
                        selected={selectedCountry}
                        countries={countries}
                        onSelect={(code) => location(code)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementBar);
