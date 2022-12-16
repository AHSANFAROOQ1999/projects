import axios from "axios";
import * as Yup from "yup";
import "./LoginPage.scss";
import React, { useState } from "react";
import { Input, message, Divider } from "antd";
import { connect, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginReducer } from "../../../redux/slices/accountSlice";
import { ErrorMessage, useFormik, FormikProvider } from "formik";
import Helmet from "react-helmet";

export const LoginPage = (props) => {
  const dispatch = useDispatch();
  const [logedin, setlogedin] = useState(false);
  const [forgotPassword, setforgotPassword] = useState(false);
  let navigate = useNavigate();
  const login = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Invalid Email"),
      password: Yup.string().required("Inavlid Password"),
    }),

    onSubmit: (data) => {
      axios
        .post(process.env.REACT_APP_BACKEND_HOST + "/storefront/signin", data)
        .then((response) => {
          setlogedin(true);
          // debugger;
          dispatch(loginReducer(response));
          navigate("/account");
          success();
        })
        .catch((err) => {
          console.log(err.response?.data.detail);
          error(err.response?.data.detail);
        });
    },
  });

  const resetPassword = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Invalid Email"),
    }),
    onSubmit: (data) => {
      // debugger;
      axios
        .post(
          process.env.REACT_APP_BACKEND_HOST + "/storefront/forget_password",
          data
        )
        .then((response) => {
          resetMail(response?.data.response);
        })
        .catch((err) => {
          console.log("Forgot Password Error", err);
        });
    },
  });

  const success = () => {
    message.success("Login Success");
  };
  const resetMail = (response) => {
    message.success(response);
  };

  const error = (err) => {
    message.error(err);
  };

  return (
    <>
      <div className="login_page">
        <Helmet>
          <title>Login | COMVERSE</title>
          <meta name="description" content="" />
          <meta name="keyword" content="" />
        </Helmet>
        <h1>Login to COMVERSE</h1>
        {forgotPassword ? (
          <FormikProvider value={resetPassword}>
            <form onSubmit={resetPassword.handleSubmit}>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                {...resetPassword.getFieldProps("email")}
                className={` ${
                  resetPassword.touched.email &&
                  resetPassword.errors.email &&
                  "invalid"
                } `}
              />
              {resetPassword.touched.email && resetPassword.errors.email ? (
                <div>{resetPassword.errors.email}</div>
              ) : null}

              <div>
                <button
                  className="forgot_pass"
                  type="button"
                  onClick={() => setforgotPassword(false)}
                >
                  Login with Existing Password
                </button>
                <button className="primary_button" type="submit">
                  Reset Password
                </button>
              </div>
            </form>
          </FormikProvider>
        ) : (
          <FormikProvider value={login}>
            <form onSubmit={login.handleSubmit}>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                {...login.getFieldProps("email")}
                className={` ${
                  login.touched.email && login.errors.email && "invalid"
                } `}
              />
              {login.touched.email && login.errors.email ? (
                <div>{login.errors.email}</div>
              ) : null}

              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...login.getFieldProps("password")}
                className={` ${
                  login.touched.password && login.errors.password && "invalid"
                } `}
              />
              {login.touched.password && login.errors.password ? (
                <div>{login.errors.password}</div>
              ) : null}
              <button
                className="forgot_pass"
                type="button"
                onClick={() => setforgotPassword(true)}
              >
                Forgot password
              </button>

              <button className="primary_button" type="submit">
                Log in
              </button>

              <Divider style={{ margin: "0" }}>OR</Divider>

              <Link className="signup" to="/signup">
                <button type="button" className="secondary_button signup">
                  SIGNUP
                </button>
              </Link>
            </form>
          </FormikProvider>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
