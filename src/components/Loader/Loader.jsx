import React from "react";
import { Spin } from "antd";
import { connect } from "react-redux";
import "./Loader.scss";

export const Loader = (props) => {
  return (
    <>
      <div className="spin">
        <Spin size={props.size} />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Loader);
