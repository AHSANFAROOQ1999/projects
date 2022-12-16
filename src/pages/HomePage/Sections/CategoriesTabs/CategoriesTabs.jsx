import React, { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import CatImage from "../../../../assets/img/catImage.png";
import ProductCard from "../../../../components/ProductCard/ProductCard";
import { Tabs } from "antd";
import "./CategoriesTabs.scss";
import TabCarousel from "../CategoriesCarousel/TabCarousel/TabCarousel";

const CategoriesTabs = (props) => {
  // console.log("props from categories tabs", props);
  const [selectedProducts, setSelectedProducts] = useState(
    props?.data?.categories[0].products
  );

  const { TabPane } = Tabs;

  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 430px)" });

  // console.log("selected products", selectedProducts);
  useEffect(() => {
    //debugger
    // console.log("new products");
  }, [selectedProducts]);

  const changeCategories = (cat) => {
    debugger;
    flushSync(() => setSelectedProducts([]));
    setSelectedProducts(cat);
  };

  return (
    <div className="categories-tabs-wrapper">
      <div className="container-xl">
        <h3 className="section-header">{props?.data?.title}</h3>

        {isDesktop ? (
          <div className="categories-tab">
            <div className="left-wrapper">
              <div className="img">
                <img
                  src={
                    props.data?.banner_img ? props?.data?.banner_img : CatImage
                  }
                  alt={props.data?.title}
                />
              </div>
              <div className="categories">
                {props.data?.categories.map((category, index) => (
                  <button
                    onClick={() => changeCategories(category.products)}
                    key={index}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="right-wrapper">
              {selectedProducts?.map(
                (product, index) =>
                  index < 8 && <ProductCard key={index} product={product} />
              )}
            </div>
          </div>
        ) : null}

        {isMobile ? (
          <div>
            <Tabs>
              {props?.data?.categories?.map((category, index) => (
                <TabPane tab={category.name} key={index}>
                  <TabCarousel
                    catHandle={category.handle}
                    products={category?.products ? category.products : null}
                  />
                </TabPane>
              ))}
            </Tabs>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CategoriesTabs;
