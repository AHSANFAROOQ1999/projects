import axios from "axios";
import React from "react";
import Helmet from "react-helmet";
import { Button, Form, Input } from "antd";
import { connect, useDispatch, useSelector } from "react-redux";
import { setPasswordMatch } from "../../redux/slices/passwordSlice";
import ComverseLogo from "../../assets/img/ComverseLogo.png";
import { useNavigate } from "react-router-dom";
import "./PasswordPage.scss";

export const PasswordPage = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkPassword = async (value) => {
    // debugger;
    // console.log(value.password);

    await axios
      .post(
        process.env.REACT_APP_BACKEND_HOST + "/storefront/check_password",
        value
      )
      .then((response) => {
        // console.log(response);
        dispatch(setPasswordMatch(response.data.match));
        sessionStorage.setItem("passwordMatch", response.data.match);
      })
      .catch((error) => {
        console.log(error);
        document.getElementsByClassName("error-message")[0].style.display =
          "block";
      });
  };
  return (
    <>
      <div className="password-page">
        <Helmet>
          <title>Password | COMVERSE</title>
          <meta name="description" content="" />
          <meta name="keyword" content="" />
        </Helmet>

        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={checkPassword}
          autoComplete="off"
        >
          <Form.Item>
            <img src={ComverseLogo} alt="Logo" width="250px" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            id="store-password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="basic" value="submit" htmlType="submit">
              Submit
            </Button>
            <p className="error-message">Invalid Password!</p>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PasswordPage);
