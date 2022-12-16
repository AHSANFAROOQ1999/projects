import axios from "axios";
import * as Yup from "yup";
import "./PasswordChangeModal.scss";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input, message } from "antd";
import { ErrorMessage, useFormik, FormikProvider } from "formik";

export const PasswordChangeModal = (props) => {
  const [visible, setVisible] = useState(false);

  const success = () => {
    message.success("Password Changed Successfully");
  };

  const error = (error) => {
    message.error(error);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const changePassword = useFormik({
    initialValues: {
      oldPass: "",
      newPass: "",
    },
    validationSchema: Yup.object({
      oldPass: Yup.string().required("Invalid Password"),
      newPass: Yup.string().required("Invalid Password"),
    }),

    onSubmit: (data) => {
      axios
        .put(
          process.env.REACT_APP_BACKEND_HOST +
            "/storefront/account?token=" +
            sessionStorage.getItem("comverse_customer_token"),
          data
        )
        .then((response) => {
          setVisible(false);
          success();
        })
        .catch((err) => {
          error(err.response.data.detail);
        });
    },
  });

  return (
    <>
      <Button className="change-password-btn" onClick={showModal}>
        Change Password
      </Button>
      <Modal
        visible={visible}
        title="Change Your Password"
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="submit"
            onClick={changePassword.handleSubmit}
          >
            Save
          </Button>,
        ]}
      >
        <FormikProvider value={changePassword}>
          <form onSubmit={changePassword.handleSubmit}>
            <label>Old Password</label>
            <Input
              id="oldPass"
              type="password"
              placeholder="Old Password"
              {...changePassword.getFieldProps("oldPass")}
              className={
                ` ${
                  changePassword.touched.oldPass &&
                  changePassword.errors.oldPass &&
                  "invalid"
                } ` + "margin"
              }
            />
            {changePassword.touched.oldPass && changePassword.errors.oldPass ? (
              <div style={{ textAlign: "end" }}>
                {changePassword.errors.oldPass}
              </div>
            ) : null}

            <label>New Password</label>

            <Input
              id="newPass"
              type="password"
              placeholder="New Password"
              {...changePassword.getFieldProps("newPass")}
              className={
                ` ${
                  changePassword.touched.newPass &&
                  changePassword.errors.newPass &&
                  "invalid"
                } ` + "margin"
              }
            />
            {changePassword.touched.newPass && changePassword.errors.newPass ? (
              <div style={{ textAlign: "end" }}>
                {changePassword.errors.newPass}
              </div>
            ) : null}
          </form>
        </FormikProvider>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordChangeModal);
