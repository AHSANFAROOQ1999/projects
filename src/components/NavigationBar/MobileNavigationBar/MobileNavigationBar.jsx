import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Select, Input, Space, Badge } from "antd";
import {
  SearchOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ImCross } from "react-icons/im";
import { UnorderedListOutlined } from "@ant-design/icons";
import MobileMegaMenu from "./MobileMegaMenu";
import MiniCart from "../../Header/Sections/MiniCart/MiniCart";
import { useSelector } from "react-redux";
import "./MobileNavigationBar.scss";
import SearchSuggestion from "../../Header/Sections/SearchSuggestion/SearchSuggestion";

const MobileNavigationBar = ({ logo, navbar, setShowMegaMenu }) => {
  const { Option } = Select;

  const [mobileNav, setMobileNav] = useState(false);
  const [mobileHeader, setMobileHeader] = useState(true);
  const { Search } = Input;
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSearchBar, setMobileSearchBar] = useState(false);
  const [mobileMegaMenu, setMobileMegaMenu] = useState(false);
  const totalProducts = useSelector((state) => state.cart.totalCount);

  const onSearch = (value) => console.log(value);

  //console.log('props from navigation bar', navbar)
  let mobileMenuRef = useRef();
  let mobileMegaMenuRef = useRef();
  let mobileSearchRef = useRef();

  useEffect(() => {
    setShowMegaMenu(false); // closing mega menu when display is mobile
    let mobileHandler = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenu(false);
      }
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target)
      ) {
        setMobileSearchBar(false);
      }
      if (
        mobileMegaMenuRef.current &&
        !mobileMegaMenuRef.current.contains(event.target)
      ) {
        setMobileMegaMenu(false);
      }
    };
    document.addEventListener("mousedown", mobileHandler);

    return () => {
      document.removeEventListener("mousedown", mobileHandler);
    };
  }, []);
  const HideNavbar = (e) => {
    e.stopPropagation();
  };
  const HideSearchBar = (e) => {
    setMobileSearchBar(false);
    setMobileHeader(true);
  };
  return (
    <>
      <div className="mobileNav">
        {mobileHeader && (
          <div className="display-flex k-row">
            <div className="logoDiv">
              <Link to="/">
                <img src={logo} />
              </Link>
            </div>
            {/* <div className="header-wrappers"> */}
            <div className="rightDiv">
              <SearchOutlined
                onClick={() => {
                  setMobileSearchBar(!mobileSearchBar);
                  setMobileHeader(false);
                }}
              />
              <Link className="cart-link" to="/cart">
                <Badge count={totalProducts} overflowCount={10}>
                  <ShoppingOutlined alt="Cart" style={{ fontSize: "22px" }} />
                </Badge>
              </Link>

              <UnorderedListOutlined
                onClick={() => {
                  setMobileNav(!mobileNav);
                  setMobileMenu(true);
                }}
              />
            </div>
            {/* </div> */}
          </div>
        )}
      </div>

      {/* Mobile View Search Bar */}
      {mobileSearchBar && (
        <div className="mob-nav">
          <div
            className="mobile-searchbar-bg"
            debugger
            onClick={(e) => {
              HideSearchBar(e);
            }}
          >
            <div
              className="mobile-searchbar"
              onClick={(e) => {
                HideNavbar(e);
              }}
            >
              <SearchSuggestion />
            </div>
          </div>
        </div>
      )}
      {/*Mobile View Menu */}
      {mobileNav ? (
        <div
          className={mobileMenu || mobileMegaMenu ? "mobile-menu" : ""}
          ref={mobileMenuRef}
        >
          {mobileMenu && (
            <>
              <div className="mobile-top">
                <ImCross
                  onClick={() => {
                    setMobileNav(false);
                    setMobileMenu(false);
                  }}
                />
                {/*                    <img src={props.logo} />
                 */}
              </div>
              <div
                className="mobile-cat"
                onClick={() => {
                  setMobileMegaMenu(!mobileMegaMenu);
                  setMobileMenu(!mobileMenu);
                }}
              >
                <UnorderedListOutlined /> <span>ALL CATEGORIES</span>
              </div>
              <ul>
                {navbar?.navigation.map((item, index) => {
                  return (
                    <>
                      <li key={index}>
                        <NavLink
                          className="mobile-navLink"
                          to={item.link}
                          onClick={() => setMobileNav(false)}
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    </>
                  );
                })}
              </ul>
            </>
          )}
          {/* Mobile View Mega Menu */}
          {!mobileMenu && mobileMegaMenu && (
            <MobileMegaMenu
              navbar={navbar}
              setMobileMenu={setMobileMenu}
              setMobileMegaMenu={setMobileMegaMenu}
              mobileMegaMenuRef={mobileMegaMenuRef}
            />
          )}
          {/*Mobile View Account and Lang Picker*/}
          {mobileMenu && !mobileMegaMenu && (
            <div className="mobile-menu-lower">
              <div>
                <NavLink className="nav-link mobileTrackOrder" to="/">
                  <i className="fa fa-map-marker " aria-hidden="true"></i>
                </NavLink>
                <NavLink
                  className="nav-link mobileAccount"
                  to="/login"
                  onClick={() => setMobileNav(false)}
                >
                  <UserOutlined />
                  Account
                </NavLink>
              </div>
              <div>
                <Select
                  defaultValue="English"
                  //onChange={handleChange}
                >
                  <Option value="english">English</Option>
                  <Option value="arabic">Arabic</Option>
                </Select>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default MobileNavigationBar;
