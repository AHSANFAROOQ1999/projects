import "./App.scss";
import axios from "axios";
import { BackTop } from "antd";
import { useEffect, useState } from "react";
import AccountPage from "./pages/customers/AccountPage/AccountPage";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/customers/LoginPage/LoginPage";
import SignUpPage from "./pages/customers/SignupPage/SignUpPage";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import AnnouncementBar from "./components/AnnouncementBar/AnnouncementBar";
import ProductPageWrapper from "./pages/ProductPage/ProductPageWrapper";
import BrandsPage from "./pages/BrandsPage/BrandsPage";
import CategoriesPage from "./pages/CategoriesPage/CategoriesPage";
import NotFound from "./pages/NotFound/NotFound";
import TrackOrderPage from "./pages/TrackOrderPage/TrackOrderPage";
import CareersPage from "./pages/custom-pages/CareersPage/CareersPage";
import CollectionPage from "./pages/CollectionPage/CollectionPage";
import Helmet from "react-helmet";
import PasswordPage from "./pages/PasswordPage/PasswordPage";
import { setPasswordEnable } from "./redux/slices/passwordSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomPage from "./pages/custom-pages/CustomPage";
import Loader from "./components/Loader/Loader";
import CartPage from "./pages/CartPage/CartPage";
import WalletPage from "./pages/customers/WalletPage/WalletPage";
import WishList from "./features/WishList/WishList";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import ThankyouPage from "./pages/CheckoutPage/Sections/ThankyouPage/ThankyouPage";
import VendorSignupPage from "./pages/VendorSignupPage/VendorSignupPage";
import ContactPage from "./pages/custom-pages/ContactPage/ContactPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import { setShowMainComps } from "./redux/slices/checkoutSlice";
import { setDefaultCountry } from "./redux/slices/multiLocationSlice";
import { UpOutlined } from "@ant-design/icons";

function App() {
  const dispatch = useDispatch();

  const [header, setHeader] = useState(null);
  const [seoTitile, setSeoTitile] = useState("");

  const passwordChecked = useSelector(
    (state) => state.password.passwordChecked
  );
  const passwordEnable = useSelector((state) => state.password.passwordEnable);
  const passwordMatch = useSelector((state) => state.password.passwordMatch);
  const country = useSelector((state) => state.multiLocation.defaultCountry);
  const loggedIn = useSelector((state) => state.account.loggedIn);

  // const showMainComps = useSelector((state) => state.checkout.showMainComps)
  const [showMainComps, setShowMainComps] = useState(
    window.location.href.includes("/checkout") ||
      window.location.href.includes("/thankyou")
      ? false
      : true
  );

  // const showMainComps = localStorage.getItem('showMainComps') || true

  const checkPasswordProtect = async () => {
    if (!passwordChecked) {
      await axios
        .get(
          process.env.REACT_APP_BACKEND_HOST +
            "/storefront/check_protect_password"
        )
        .then((res) => {
          setSeoTitile(res?.data);
          // console.log(seoTitile, "setSeoTitile");
          if (res?.data?.enable_password === true) {
            //debugger
            sessionStorage.setItem(
              "passwordEnable",
              res?.data?.enable_password
            );
            localStorage.setItem("Seo_title", res?.data?.seo_title);
            localStorage.setItem("Seo_description", res?.data?.seo_description);
            localStorage.setItem("Seo_keyword", res?.data?.seo_keywords);

            dispatch(setPasswordEnable(res?.data?.enable_password));
          }
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    if (passwordMatch || !passwordEnable) {
      getHeaders();
    }
    //dispatch(setShowMainComps(!showMainComps))
    checkPasswordProtect();
    window.scrollTo(0, 0);
  }, [passwordMatch, loggedIn]);

  useEffect(() => {
    checkPasswordProtect();
    window.scrollTo(0, 0);
  }, [country]);

  const getHeaders = async () => {
    await axios
      .get(process.env.REACT_APP_BACKEND_HOST + "/storefront/header")
      .then((res) => {
        // console.log('Header Api Response', res)
        setHeader(res?.data?.header);
        if (country === "" || res?.data?.header?.country_list[0]) {
          dispatch(setDefaultCountry(res?.data?.header?.country_list[0]));
        }
      })
      .catch((err) => {
        console.log("Header Api Error:", err);
      });
  };

  const style = {
    height: 40,
    width: 40,
    lineHeight: "40px",
    borderRadius: 25,
    backgroundColor: "#222831",
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
  };

  return (
    <>
      <div className="App">
        <BackTop>
          <div style={style}>
            <UpOutlined />
          </div>
        </BackTop>
        <Helmet>
          <title>
            {seoTitile?.seo_title
              ? seoTitile.seo_title
              : seoTitile?.title
              ? seoTitile?.title
              : "COMVERSE | Redefining Commerse"}
          </title>
          <meta name="description" content={seoTitile.seo_description} />
          <meta name="keyword" content={seoTitile.seo_keywords} />
        </Helmet>

        {passwordChecked && passwordEnable && !passwordMatch ? (
          <>
            <BrowserRouter>
              <PasswordPage />
            </BrowserRouter>
          </>
        ) : passwordMatch || !passwordEnable ? (
          <>
            <BrowserRouter>
              {showMainComps && (
                <>
                  <AnnouncementBar announcementHeader={header} />
                  <Header header={header} />
                  <NavigationBar
                    navbar={header?.navigation_bar}
                    logo={header?.header?.logo_image}
                  />
                </>
              )}

              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route
                  path="/product/:handle"
                  element={<ProductPageWrapper />}
                />
                <Route path="/brands/all" element={<BrandsPage />} />
                {/* <Route path="/test" element={<Filters />} /> */}
                <Route
                  path="/categories/:catHandle"
                  element={<CategoriesPage />}
                />
                <Route path="*" element={<NotFound />} />
                <Route path="/wallet" element={<WalletPage />} />

                <Route path="/trackyourorder" element={<TrackOrderPage />} />
                <Route
                  path="/trackyourorder/error"
                  element={<TrackOrderPage />}
                />

                <Route path="/page/contactus" element={<ContactPage />} />
                <Route path="/page/careers" element={<CareersPage />} />
                {/* <Route path="/orderDetail/:id" element={<OrderDetail />} /> */}

                {/* Collection Page Routes */}

                <Route
                  path="/collection/:handle"
                  element={<CollectionPage pageType={"collection"} />}
                />
                <Route
                  path="/brand/:handle"
                  element={<CollectionPage pageType={"brand"} />}
                />
                <Route
                  path="/promotions/:handle"
                  element={<CollectionPage pageType={"promotions"} />}
                />
                <Route
                  path="/vendor/:handle"
                  element={<CollectionPage pageType={"vendor"} />}
                />
                <Route path="/password" element={<PasswordPage />} />

                <Route path="/cart" element={<CartPage />} />

                <Route path="/wishlist" element={<WishList />} />

                <Route
                  path="/checkout"
                  element={<CheckoutPage logo={header?.header?.logo_image} />}
                />

                <Route path="/thankyou/:id" element={<ThankyouPage />} />

                <Route path="/sellwithus" element={<VendorSignupPage />} />
                <Route path="/page/:pageHandle" element={<CustomPage />} />

                <Route path="/search/:query" element={<SearchPage />} />
              </Routes>
              {showMainComps && <Footer />}
            </BrowserRouter>
          </>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}

export default App;
