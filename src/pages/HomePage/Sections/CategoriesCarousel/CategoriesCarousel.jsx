import React from "react";
import { Tabs } from "antd";
import { connect } from "react-redux";
import TabCarousel from "./TabCarousel/TabCarousel";
import "./CategoriesCarousel.scss";
export const CategoriesCarousel = (props) => {
  const { TabPane } = Tabs;

  return (
    <>
      <div className="collection-tabs-wrapper">
        <div className="container-xl position-rel">
          <h3 className="collection-name">{props?.data?.title}</h3>
          {props?.data?.categories?.length ? (
            <Tabs className="collection-tabs">
              {props?.data?.categories?.map((cat, key) => {
                return (
                  <TabPane tab={cat.handle.replace(/-/g, " ")} key={key}>
                    <TabCarousel
                      catHandle={cat.handle}
                      products={cat.products}
                    />
                  </TabPane>
                );
              })}
            </Tabs>
          ) : null}

          {/* <Tab className="collection-tabs" menu={{ text: true }} panes={panes} /> */}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesCarousel);
