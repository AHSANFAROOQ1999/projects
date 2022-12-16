import { Collapse } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import DOMPurify from "dompurify";
import featureArrow from "../../../assets/svg/featureArrow.svg";
import "./ProductDetailsTabs.scss";
import ReveiwsSection from "./ReveiwsSection";

export const ProductDetailsTabs = (props) => {
  // console.log(props,"props");
  const [cleanDescription, setcleanDescription] = useState(
    DOMPurify.sanitize(props.product.description, {
      USE_PROFILES: { html: true },
    })
  );

  useEffect(() => {}, [props.product.handle]);

  const { Panel } = Collapse;

  const description = (
    <>
      <div
        className="description-content"
        dangerouslySetInnerHTML={{ __html: cleanDescription }}
      />
    </>
  );
  const specification = (
    <>
      {props?.product?.features.map((feature, index) => {
        return (
          <div key={index}>
            {feature.feature_title ? (
              <div className="specifications">
                <div className="featureTitle">
                  <img src={featureArrow} alt="" />
                  <span>{feature.feature_title}</span>
                </div>
                <div className="featureDetails">
                  <span>{feature.feature_details}</span>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
  const reveiws = (
    <>
      <ReveiwsSection product={props} />
    </>
  );
  return (
    <>
      <Collapse bordered={false} ghost expandIconPosition="right">
        <Panel className="descriptionSpan" header="DESCRIPTION" key="1">
          {description}
        </Panel>
        <Panel className="specificationSpan" header="SPECIFICATION" key="2">
          {specification}
        </Panel>
        <Panel className="specificationSpan" header="REVEIWS" key="3">
          {reveiws}
        </Panel>
      </Collapse>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetailsTabs);
