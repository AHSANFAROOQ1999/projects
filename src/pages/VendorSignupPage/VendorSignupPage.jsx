import React, { useEffect, useReducer, useState } from "react";
import { Steps } from "antd";
import { Input, Button } from "antd";
import {
  Formik,
  Form,
  Field,
  FieldArray,
  ErrorMessage,
  useField,
} from "formik";
import * as Yup from "yup";
import axios from "axios";
import Helmet from "react-helmet";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CgFileDocument } from "react-icons/cg";
import { BsShop, BsBank } from "react-icons/bs";

import {
  UserOutlined,
  SolutionOutlined,
  LoadingOutlined,
  SmileOutlined,
} from "@ant-design/icons";

import "./VendorSignupPage.scss";
const { Step } = Steps;

const defaultState = {
  showPage1: true,
  showPage2: false,
  showPage3: false,
  showPage4: false,
};
const reducer = (state, action) => {
  console.log(state, action);
  if (action.type === "Page1") {
    return {
      ...state,
      showPage1: true,
      showPage2: false,
      showPage3: false,
      showPage4: false,
    };
  }
  if (action.type === "Page2") {
    return {
      ...state,
      showPage1: false,
      showPage2: true,
      showPage3: false,
      showPage4: false,
    };
  }
  if (action.type === "Page3") {
    return {
      ...state,
      showPage1: false,
      showPage2: false,
      showPage3: true,
      showPage4: false,
    };
  }
  if (action.type === "Page4") {
    return {
      ...state,
      showPage1: false,
      showPage2: false,
      showPage3: false,
      showPage4: true,
    };
  }
  return state;
};

// yup validation

const validationSchema = Yup.object().shape({
  // first form
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
  lastName: Yup.string()
    .min(2, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
  phone: Yup.string()
    .matches(/^(\d{11}(\,\d{11}){0,2})$/, "Invalid Number")
    .required("Required"),
  email: Yup.string().email("Invalid email format").required("Required"),
  // second form
  storeName: Yup.string()
    .min(2, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
  companyName: Yup.string()
    .min(2, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
  productsYouSell: Yup.string()
    .min(2, "Too Short!")
    .max(200, "Too Long!")
    .required("Required"),
  address: Yup.string()
    .min(2, "Too Short!")
    .max(200, "Too Long!")
    .required("Required"),
  // third form
  tradeLicenseFile: Yup.mixed().required("File is required"),
  nationalIDFile: Yup.mixed().required("File is required"),
  // fourth form
  beneficiaryName: Yup.string()
    .min(2, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
  bankName: Yup.string()
    .min(2, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
  branchName: Yup.string()
    .min(2, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
  accountNumber: Yup.string()
    .min(2, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
  ibanNumber: Yup.string()
    .min(2, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
  swiftCode: Yup.string()
    .min(2, "Too Short!")
    .max(20, "Too Long!")
    .required("Required"),
  bankDocFile: Yup.mixed().required("File is required"),
});

const VendorSignupPage = (formData) => {
  // debugger
  console.log("formData", formData);
  const [state, dispatch] = useReducer(reducer, defaultState);

  // states for file uploads

  const onSubmitForm = (formData) => {
    const {
      firstName,
      lastName,
      phone,
      email,
      storeName,
      companyName,
      productsYouSell,
      address,
      tradeLicenseFile,
      nationalIDFile,
      beneficiaryName,
      bankName,
      branchName,
      accountNumber,
      ibanNumber,
      swiftCode,
      bankDocFile,
    } = formData;
    console.log(formData, "formData");
    let data = {
      name: firstName + " " + lastName,
      email: email,
      phone: phone,
      address: address,
      store_name: storeName,
      company_phone: companyName,
      products_you_sell: productsYouSell,
      beneficiary_name: beneficiaryName,
      bank_name: bankName,
      branch_name: branchName,
      account_number: accountNumber,
      iban: ibanNumber,
      swift_code: swiftCode,
    };
    let bodyFormData = new FormData();
    bodyFormData.append("tradeLicense", tradeLicenseFile);
    bodyFormData.append("nationalId", nationalIDFile);
    bodyFormData.append("cancelCheck", bankDocFile);
    bodyFormData.append("data", JSON.stringify(data));

    //console.log(bodyFormData, 'bodyFormData')

    // sending axios call
    axios({
      method: "post",
      url: process.env.REACT_APP_BACKEND_HOST + "/vendors/external_signup",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        console.log(response);
        // debugger
      })
      .catch((error) => {
        //handle error
        // debugger
        console.log(error);
      });
  };

  // useEffect(() => {
  //   console.log('re renders')
  // }, [render])

  return (
    <div className="vendor-page-wrapper">
      <Helmet>
        <title>Sell With Us | COMVERSE</title>
        <meta name="description" content="" />
        <meta name="keyword" content="" />
      </Helmet>
      <div className="container-xl">
        <div className="headings">
          <h1>Start selling your items on Comverseglobal.com</h1>
          <p>Create a Store</p>
        </div>
        <div className="step-form">
          <div className="steps">
            <Steps>
              <Step
                className={state.showPage1 ? "active" : "non-active"}
                //status='finish'
                status="process"
                title="User"
                icon={<UserOutlined />}

                // onClick={() => {
                //   dispatch({ type: 'Page1' })
                // }}
              />

              <Step
                className={state.showPage2 ? "active" : "non-active"}
                // status='finish'
                status="process"
                title="Store"
                icon={<BsShop />}
                // onClick={() => {
                //   dispatch({ type: 'Page2' })
                // }}
              />

              <Step
                className={state.showPage3 ? "active" : "non-active"}
                status="process"
                title="Document"
                icon={<CgFileDocument />}
                // onClick={() => {
                //   dispatch({ type: 'Page3' })
                // }}
              />
              <Step
                className={state.showPage4 ? "active" : "non-active"}
                //status='wait'
                status="process"
                title="Bank"
                icon={<BsBank />}
                // onClick={() => {
                //   dispatch({ type: 'Page4' })
                // }}
              />
            </Steps>
          </div>
          <div className="vendor-form">
            <Formik
              initialValues={{
                // first form
                firstName: "",
                lastName: "",
                phone: "",
                email: "",
                // second form
                storeName: "",
                companyName: "",
                productsYouSell: "",
                address: "",
                // third form
                tradeLicenseFile: "",
                nationalIDFile: "",
                // fourth form
                beneficiaryName: "",
                bankName: "",
                branchName: "",
                accountNumber: "",
                ibanNumber: "",
                swiftCode: "",
                bankDocFile: "",
              }}
              validationSchema={validationSchema}
              //enableReinitialize={true}
              //   onSubmitForm(values)
              //validateOnBlur={true}
              //validateOnChange={true}
              //isValidating={true}
              //validateOnMount={false}
              onSubmit={(values, { setErrors, resetForm }) => {
                //console.log(values)
                // onSubmitForm(values)

                onSubmitForm(values);
                if (state.showPage4) {
                  //console.log(values)
                  onSubmitForm(values);
                }

                //setErrors({})
                // resetForm({
                //   errors: {},
                //   touched: {},
                // })
              }}
            >
              {({
                values,
                setFieldValue,
                isValid,
                validateField,
                setTouched,
                isSubmitting,
                errors,
                touched,
              }) => (
                <Form>
                  {state.showPage1 && (
                    <>
                      <Field
                        name="firstName"
                        type="text"
                        placeholder="First Name"
                      />
                      <ErrorMessage component="div" name="firstName" />

                      <Field
                        name="lastName"
                        type="text"
                        placeholder="Last Name"
                      />
                      <ErrorMessage component="div" name="lastName" />

                      <Field name="phone" type="number" placeholder="Phone" />
                      <ErrorMessage component="div" name="phone" />

                      <Field name="email" type="email" placeholder="Email" />
                      <ErrorMessage component="div" name="email" />

                      <button
                        type="submit"
                        // type={
                        //   values.firstName &&
                        //   values.lastName &&
                        //   values.phone &&
                        //   values.email
                        //     ? 'button'
                        //     : 'submit'
                        // } // the form validation errors are only seen all at once when the user clicks the button type submit
                        className="next"
                        id="firstNext"
                        //disabled={isSubmitting}
                        disabled={
                          errors.firstName ||
                          errors.lastName ||
                          errors.phone ||
                          errors.email
                        }
                        onClick={() => {
                          if (
                            values.firstName &&
                            values.lastName &&
                            values.phone &&
                            values.email
                            //&& isValid as it is true when all the field are entered and validated but our is step form
                          ) {
                            console.log(errors.phone);
                            //errors = {}
                            console.log(touched, "touched");
                            setTouched({}, false);
                            console.log(
                              touched,
                              "touched after   setTouched({}, false)"
                            );
                            // this condition is just to stop the page from moving to the next page if the user has not filled the form
                            dispatch({ type: "Page2" }); // isValid is true/flase only when validationSchema is cheched and form moves next when no field is touched
                          }
                        }}
                      >
                        Next
                      </button>
                    </>
                  )}
                  {state.showPage2 && (
                    <>
                      <Field
                        name="storeName"
                        type="text"
                        placeholder="Store Name"
                      />

                      <ErrorMessage component="div" name="storeName" />

                      <Field
                        name="companyName"
                        type="text"
                        placeholder="Company Name"
                      />

                      <ErrorMessage component="div" name="companyName" />

                      <Field
                        name="productsYouSell"
                        type="text"
                        placeholder="Product You Sell"
                      />
                      <ErrorMessage component="div" name="productsYouSell" />
                      <Field
                        as="textarea"
                        name="address"
                        type="text"
                        placeholder="Enter Your Full Address"
                      />
                      <ErrorMessage component="div" name="address" />
                      <div className="buttons">
                        <button
                          type="button"
                          className="back"
                          onClick={() => {
                            dispatch({ type: "Page1" });
                          }}
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="next"
                          // disabled={
                          //   errors.storeName ||
                          //   errors.companyName ||
                          //   errors.productsYouSell ||
                          //   errors.address
                          // } as when button is pressed the form validation errors are not seen all at once when the user clicks the button type submit
                          onClick={() => {
                            if (
                              values.storeName &&
                              values.companyName &&
                              values.productsYouSell &&
                              values.address &&
                              errors.storeName === undefined &&
                              errors.companyName === undefined &&
                              errors.productsYouSell === undefined &&
                              errors.address === undefined

                              // &&
                              // isValid
                            ) {
                              setTouched({}, false);
                              dispatch({ type: "Page3" });
                            }
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </>
                  )}
                  {state.showPage3 && (
                    <>
                      <div className="upload-file">
                        {/* <input type='file' onChange={(event) => {}} /> */}
                        <p>Upload Trade License</p>

                        {values.tradeLicenseFile && (
                          <p>{values.tradeLicenseFile.name}</p>
                        )}
                        <Upload
                          onChange={(file, fileList) => {
                            if (file.status !== "uploading") {
                              //console.log(file, fileList)
                              //console.log(file.file.originFileObj)
                              setFieldValue(
                                "tradeLicenseFile",
                                file.file.originFileObj
                              );
                            }
                          }}
                          maxCount={1}
                          // thumbUrl={
                          //   'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
                          // }
                        >
                          <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                      </div>
                      <ErrorMessage component="div" name="tradeLicenseFile" />

                      <div className="upload-file">
                        {/* <input type='file' onChange={(event) => {}} /> */}
                        <p>
                          Upload National ID (Emirates ID, or Passport copy with
                          VISA)
                        </p>
                        {values.nationalIDFile && (
                          <p>{values.nationalIDFile.name}</p>
                        )}

                        <Upload
                          onChange={(file, fileList) => {
                            if (file.status !== "uploading") {
                              //console.log(file, fileList)
                              //console.log(file.file.originFileObj)
                              setFieldValue(
                                "nationalIDFile",
                                file.file.originFileObj
                              );
                            }
                          }}
                          maxCount={1}
                          // thumbUrl={
                          //   'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
                          // }
                        >
                          <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                        {/* <input
                          type='file'
                          onChange={(event) =>
                            setFieldValue('idFile', event.target.files[0])
                          }
                        /> */}
                      </div>
                      <ErrorMessage component="div" name="nationalIDFile" />

                      <div className="buttons">
                        <button
                          type="button"
                          className="back"
                          onClick={() => {
                            dispatch({ type: "Page2" });
                          }}
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          // disabled={
                          //   errors.tradeLicenseFile || errors.nationalIDFile
                          // }
                          className="next"
                          onClick={() => {
                            {
                              setTouched({}, false);

                              if (
                                values.tradeLicenseFile &&
                                values.nationalIDFile &&
                                errors.tradeLicenseFile === undefined &&
                                errors.nationalIDFile === undefined
                              ) {
                                dispatch({ type: "Page4" });
                              }
                            }
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </>
                  )}
                  {state.showPage4 && (
                    <>
                      <Field
                        name="beneficiaryName"
                        type="text"
                        placeholder="Beneficiary Name"
                      />
                      <ErrorMessage component="div" name="beneficiaryName" />

                      <Field
                        name="bankName"
                        type="text"
                        placeholder="Bank Name"
                      />
                      <ErrorMessage component="div" name="bankName" />

                      <Field
                        name="branchName"
                        type="text"
                        placeholder="Branch Name"
                      />
                      <ErrorMessage component="div" name="branchName" />

                      <Field
                        name="accountNumber"
                        type="number"
                        placeholder="Account Number"
                      />
                      <ErrorMessage component="div" name="accountNumber" />

                      <Field
                        name="ibanNumber"
                        type="text"
                        placeholder="IBAN Number"
                      />
                      <ErrorMessage component="div" name="ibanNumber" />

                      <Field
                        name="swiftCode"
                        type="number"
                        placeholder="Swift Code"
                      />
                      <ErrorMessage component="div" name="swiftCode" />

                      <div className="upload-file">
                        {/* <input type='file' onChange={(event) => {}} /> */}
                        <p className="red-para">
                          Upload either certified and stamped document by the
                          bank with having the information mentioned above OR
                          Cancelled Cheque.
                        </p>
                        {values.bankDocFile && <p>{values.bankDocFile.name}</p>}
                        <Upload
                          onChange={(file, fileList) => {
                            if (file.status !== "uploading") {
                              //console.log(file, fileList)
                              //console.log(file.file.originFileObj)
                              setFieldValue(
                                "bankDocFile",
                                file.file.originFileObj
                              );
                            }
                          }}
                          maxCount={1}
                        >
                          <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                      </div>
                      <ErrorMessage component="div" name="bankDocFile" />

                      <div className="buttons">
                        <button
                          type="button"
                          className="back"
                          onClick={() => {
                            dispatch({ type: "Page3" });
                          }}
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting} // check if all fields are valid || whether the form is currently submitting
                          className="next"
                        >
                          Complete
                        </button>
                      </div>
                    </>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSignupPage;
