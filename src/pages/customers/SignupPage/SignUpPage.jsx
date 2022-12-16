import axios from "axios";
import * as Yup from "yup";
import "./SignUpPage.scss";
import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Input, message, Divider, Button } from "antd";
import { ErrorMessage, Field, Formik, Form } from "formik";
import { loginReducer } from "../../../redux/slices/accountSlice";
import Helmet from "react-helmet";
export const SignUpPage = (props) => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [Login, setLogin] = useState(false);

  const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(4, "Too Short!")
      .max(50, "Too Long!")
      .required("Required")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
    lastName: Yup.string()
      .min(4, "Too Short!")
      .max(50, "Too Long!")
      .required("Required")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .required("Password cannot be empty")
      .min(4, "Password is Too Short!"),
  });

  const signup = (data) => {
    console.log("axios", data);
    let body = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      has_account: true,
    };
    axios
      .post(process.env.REACT_APP_BACKEND_HOST + "/storefront/signup", body)
      .then((response) => {
        setLogin(true);
        debugger;
        dispatch(loginReducer(response));
        navigate("/account");
        success();
      })
      .catch((err) => {
        console.log("Signup Api Error: ", err.response?.data.detail);
        error(err.response?.data.detail);
      });
  };

  const success = () => {
    message.success("Signup Success");
  };

  const error = (err) => {
    message.error(err);
  };

  return (
    <>
      <div className="signup_page">
        <Helmet>
          <title>Signup | COMVERSE</title>
          <meta name="description" content="" />
          <meta name="keyword" content="" />
        </Helmet>
        <h1>Signup to COMVERSE</h1>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            signup(values);
            // same shape as initial values
            // console.log(values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Field
                name="firstName"
                placeholder="First Name"
                className={` ${
                  touched.firstName && errors.firstName && "invalid"
                } `}
              />
              {errors.firstName && touched.firstName ? (
                <div>{errors.firstName}</div>
              ) : null}
              <Field
                name="lastName"
                placeholder="Last Name"
                className={` ${
                  touched.lastName && errors.lastName && "invalid"
                } `}
              />
              {errors.lastName && touched.lastName ? (
                <div>{errors.lastName}</div>
              ) : null}
              <Field
                name="email"
                type="email"
                placeholder="Email"
                className={` ${touched.email && errors.email && "invalid"} `}
              />
              {errors.email && touched.email ? <div>{errors.email}</div> : null}
              <Field
                name="password"
                type="password"
                placeholder="Passowrd"
                className={` ${
                  touched.password && errors.password && "invalid"
                } `}
              />
              {errors.password && touched.password ? (
                <div>{errors.password}</div>
              ) : null}
              <button className="primary_button" type="submit">
                SignUp
              </button>

              <Divider style={{ margin: "0" }}>OR</Divider>

              <Link className="signup" to="/login">
                <button type="button" className="secondary_button signup">
                  Login
                </button>
              </Link>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage);
