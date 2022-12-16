import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import PageBanner from "../../components/PageBanner/PageBanner";
import CategoryCard from "./Sections/CategoryCard";
import "./CategoriesPage.scss";

export const CategoriesPage = (props) => {
  const firstRender = useRef(true);
  let catHandle = useParams();
  // console.log("CatergoriesPage Handle", catHandle);
  // debugger;

  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({});
  const [showLoader, setShowLoader] = useState(true);
  const [colorList, setColorList] = useState([
    "#F3EAEF",
    "#DAF6F8",
    "#EBEBEB",
    "#F5EFE7",
    "#E2EFF5",
    "#FEEBF3",
    "#FFF3DB",
    "#F3EAEF",
    "#F3EAEF",
    "#DAF6F8",
  ]);

  useEffect(() => {
    firstRender.current = false;
    if (firstRender) {
      fetchData();
    }
  }, []);

  const fetchData = () => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_HOST +
          "/storefront/sub_category_list/" +
          catHandle?.catHandle
      )
      .then((response) => {
        // debugger;
        // console.log("Sub Category Response: ", response);

        setCategories(response.data.sub_category);
        setData(response.data);
        setShowLoader(false);
      })
      .catch(function (error) {
        // console.log(error)
        setShowLoader(false);
      });
  };

  return (
    <>
      <Helmet>
        <title>
          {data.seo_title ? data.seo_title + " | COMVERSE" : "| COMVERSE"}
        </title>
        <meta name="description" content={data.seo_description} />
        <meta name="keyword" content={data.seo_keywords} />
      </Helmet>
      {showLoader ? (
        <div className="home-loader">
          <Loader active inline="centered" />
        </div>
      ) : categories.length > 0 ? (
        <>
          <PageBanner
            handle={catHandle.catHandle}
            productsFrom={"category_handle"}
          />
          <div className="categories-page">
            <div className="container-xl">
              <div className="cat-card-wrapper">
                {categories.length > 0
                  ? categories.map((cat, index) => {
                      const colorIndex = index % colorList.length;
                      return (
                        <CategoryCard
                          key={index}
                          color={colorList[colorIndex]}
                          cat={cat}
                        />
                      );
                    })
                  : "No Categories"}
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesPage);
