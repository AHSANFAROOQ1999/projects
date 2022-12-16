import React from "react";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

function CareersPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="careers-page">
      <Helmet>
        <title>Careers | COMVERSE</title>
        <meta name="description" content="" />
        <meta name="keyword" content=" " />
      </Helmet>
      <div className="main-heading">
        <h1>Careers</h1>
      </div>
      <div className="careers-content">
        <h3>
          Discover rewarding career opportunities with &nbsp;
          <a href="/">comverseglobal.com</a>. Please submit your CV to: &nbsp;
          <a href="mailto:info@comverseglobal.com">info@comverseglobal.com</a>
        </h3>
      </div>
    </div>
  );
}

export default CareersPage;
