import { connect } from "react-redux";
import ProductPage from "./ProductPage";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ProductPageWrapper = (props) => {
  let { handle } = useParams();
  // console.log("ProductPageWrapper: ", handle);
  useEffect(() => {}, [handle]);

  return (
    <>
      <ProductPage handle={handle} />
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProductPageWrapper);
