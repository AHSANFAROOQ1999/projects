import { useEffect, useState } from "react";
import React from "react";
import { Button, message, Space } from "antd";
// import callContact from "../../../assets/img/callContact.png";
// import emailContact from "../../../assets/img/emailContact.png";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import axios from "axios";
import { MailTwoTone, PhoneTwoTone } from "@ant-design/icons";
import "./ContactPage.scss";
import { Formik, Form, Field } from "formik";

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required !"),
  message: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required !"),
  email: Yup.string().email("Invalid email !").required("Required !"),
});

function ContactPage() {
  // const [data, setdata] = useState("");
  let data = "";
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = () => {
    // console.log("submit", data);
    axios
      .post(process.env.REACT_APP_BACKEND_HOST + "/storefront/contact-us", data)
      .then((response) => {
        success(response);
        console("submit");
      })
      .catch((err) => {
        console.log(err);
        error(error);
      });
  };

  const error = (err) => {
    debugger;
    message.error("Could Not Submit it");
  };
  const success = (err1) => {
    message.success(err1);
  };

  return (
    <>
      <div className="contact-us-page">
        <Helmet>
          <title>Contact Us | COMVERSE</title>
          <meta name="description" content="" />
          <meta name="keyword" content=" " />
        </Helmet>
        <div className="inner-wrapper">
          <div className="container-md">
            <div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.6264984141403!2d51.52406131501192!3d25.316749983840705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDE5JzAwLjMiTiA1McKwMzEnMzQuNSJF!5e0!3m2!1sen!2s!4v1631519259756!5m2!1sen!2s"
                width="100%"
                height="320"
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>
            <div className="contact-form-detail">
              <div className="contact-form-wrapper">
                <h1 className="heading">SEND YOUR QUERIES!</h1>
                <p>
                  Your email address not be published. Required fields are
                  marked by "*"
                </p>
                <Formik
                  initialValues={{
                    name: "",
                    message: "",
                    email: "",
                  }}
                  validationSchema={SignupSchema}
                  onSubmit={(values) => {
                    // same shape as initial values
                    // console.log(values);
                    // setdata(values);
                    data = values;
                    // console.log(data, "data");

                    onSubmit();
                  }}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <div className="contect-form">
                        <div className="form-feild">
                          <p>Name</p>
                          <Field
                            name="name"
                            placeholder="Enter Your Name"
                            required
                          />
                          {errors.name && touched.name ? (
                            <div className="error">{errors.name}</div>
                          ) : null}
                        </div>
                        <div className="form-feild">
                          <p>Email</p>
                          <Field
                            name="email"
                            type="email"
                            placeholder="Enter Your Email"
                            required
                          />
                          {errors.email && touched.email ? (
                            <div className="error">{errors.email}</div>
                          ) : null}
                        </div>
                      </div>
                      <p className="message-feild-email">Message</p>
                      <Field
                        name="message"
                        as="textarea"
                        id="message-feild"
                        type="text"
                        required
                        placeholder="Enter Your message"
                      />
                      {errors.message && touched.message ? (
                        <div className="error">{errors.message}</div>
                      ) : null}
                      <button type="submit" className="formik-button">
                        Submit
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
              <div>
                <h1>ADDRESS:</h1>
                <p className="para1">
                  In order to resolve a complaint regarding the Site or to
                  receive further information regarding use of the Site, please
                  contact us at:
                  <p>
                    COMVERSE Internet trading &amp; Marketing WLL,2nd Floor
                    Vouge Tower MM Alam Road Lahore Pakistan
                  </p>
                </p>
                <div className="k-row contact-info">
                  <div>
                    <PhoneTwoTone style={{ fontSize: "30px" }} />
                    {/* <img src={callContact} alt="Phone" /> */}
                  </div>
                  <div>
                    <p>+92 300 0342366</p>
                  </div>
                </div>
                <div className="k-row contact-info">
                  <div>
                    <MailTwoTone style={{ fontSize: "30px" }} />
                    {/* <img src={emailContact} alt="Email" /> */}
                  </div>
                  <div>
                    <p>info@comverseglobal.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactPage;
