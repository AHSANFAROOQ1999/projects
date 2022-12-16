import React, { useState, useEffect, useRef } from "react";
import Helmet from "react-helmet";
import Loader from "../../components/Loader/Loader";
import axios from "axios";
import DOMPurify from "dompurify";
import { useLocation, useParams } from "react-router-dom";

function CustomPage(props) {
  const [data, setdata] = useState();
  const [content, setcontent] = useState();
  const [showLoader, setShowLoader] = useState(false);
  const [cleanDescription, setcleanDescription] = useState();
  let param = useParams().pageHandle;
  let location = useLocation().pathname;
  let handle = param;

  useEffect(() => {
    fetchCustomPageData();
    window.scrollTo(0, 0);
  }, [handle, location]);

  const fetchCustomPageData = () => {
    axios
      .get(process.env.REACT_APP_BACKEND_HOST + "/storefront/page/" + handle)
      .then((response) => {
        console.log(response, "response");
        setdata(response.data);
        setcontent(response.data.content);
        setShowLoader(false);
        setcleanDescription(
          DOMPurify.sanitize(response.data.content, {
            USE_PROFILES: { html: true },
          })
        );
      })
      .catch(function (error) {
        setShowLoader(false);
        console.log(error);
      });
  };
  return (
    <div>
      <div className="Custom-page">
        {data?.title ? (
          <>
            <Helmet>
              <title>
                {data?.seo_title
                  ? data?.seo_title + " | COMVERSE"
                  : data?.title
                  ? data?.title + " | COMVERSE"
                  : "COMVERSE | Redefining Commerse"}
              </title>
              <meta name="description" content={data?.seo_description} />
              <meta name="keyword" content={data?.seo_keywords} />
            </Helmet>
            <div className="container Custom-page">
              <div className="CustomPage-title">
                <h1> {data?.title}</h1>
              </div>

              <div className="CustomPage-content">
                <div
                  dangerouslySetInnerHTML={{
                    __html: cleanDescription,
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="home-loader">
            <Loader active inline="centered" />
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomPage;
