import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { UnorderedListOutlined, DownOutlined } from "@ant-design/icons";
import { GoLocation } from "react-icons/go";
import { useMediaQuery } from "react-responsive";

import "./NavigationBar.scss";
import MobileNavigationBar from "./MobileNavigationBar/MobileNavigationBar";
import MegaMenu from "./MegaMenu";
export const NavigationBar = (props) => {
  //console.log('Props from navigation', props)
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  //const { Option } = Select
  const isMobile = useMediaQuery({ query: "(max-width: 769px)" });

  // except mega menu and category div ; showMegaMenu false on all
  let megaMenuRef = useRef();
  let catRef = useRef();

  useEffect(() => {
    let handler = (event) => {
      if (
        megaMenuRef.current &&
        !megaMenuRef.current.contains(event.target) &&
        catRef.current &&
        !catRef.current.contains(event.target)
      ) {
        setShowMegaMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);
  return (
    <>
      {/*Desktop view Navbar */}

      {!isMobile && (
        <div className="nav">
          <div className="container-xl">
            {/*Category*/}

            <div className="left">
              {props.navbar?.show_category_structure && (
                <div
                  className="cat"
                  onClick={() => {
                    setShowMegaMenu(!showMegaMenu);
                  }}
                  ref={catRef}
                >
                  <UnorderedListOutlined />
                  <NavLink className="nav-link" to="/">
                    More Categories
                  </NavLink>
                  <DownOutlined />

                  <div className="k-divider"></div>
                </div>
              )}

              {/* Menu  */}

              <div className="menu-link">
                <ul>
                  {props.navbar?.navigation.map((item, index) => {
                    return (
                      <li key={index}>
                        <NavLink className="nav-link" to={item.link}>
                          {item.label}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/*Order Tracking */}
            {props.navbar?.show_track_order && (
              <div className="trackOrder">
                <GoLocation />
                <NavLink className="nav-link" to="/trackyourorder">
                  Track your order
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Mega Menu when category clicked */}
      {showMegaMenu && (
        <MegaMenu
          navbar={props?.navbar}
          megaMenuRef={megaMenuRef}
          setShowMegaMenu={setShowMegaMenu}
        />
      )}

      {/*Mobile view Navbar */}

      {isMobile && (
        <MobileNavigationBar
          logo={props?.logo}
          navbar={props?.navbar}
          setShowMegaMenu={setShowMegaMenu}
        />
      )}
    </>
  );
};

export default NavigationBar;
