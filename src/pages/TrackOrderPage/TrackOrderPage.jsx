import React, { useState } from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./TrackOrderPage.scss";

export const TrackOrderPage = (props) => {
  const [orderNo, setOrderNo] = useState("");

  const handleChange = (e) => setOrderNo(e.target.value);

  return (
    <>
      <div className="track-sec">
        <Helmet>
          <title>Track your Order | COMVERSE</title>
          <meta name="description" content="" />
          <meta name="keyword" content=" " />
        </Helmet>
        <h1>Track Your Order</h1>
        <input
          placeholder="Enter Order No."
          type="text"
          onChange={handleChange}
        ></input>
        {window.location.href.includes("error") ? (
          <p> Incorrect Order Number </p>
        ) : null}

        <br />
        <Link to={"/orderDetail/" + orderNo}>
          <button>Track</button>
        </Link>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TrackOrderPage);
