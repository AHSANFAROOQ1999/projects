import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Formik, Form } from "formik";
import { connect } from "react-redux";
import "./Footer.scss";
import "../../styles/Old.scss";
import axios from "axios";
import { Button, Icon, Input } from "antd";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { HiOutlineMail } from "react-icons/hi";

export const Footer = (props) => {
  const [footer, setFooter] = useState(null);
  const [email, setEmail] = useState("");
  const [emailSend, setEmailSend] = useState(false);

  useEffect(() => {
    getFooter();
  }, []);

  const getFooter = () => {
    axios
      .get(process.env.REACT_APP_BACKEND_HOST + "/storefront/footer")
      .then((res) => {
        // const footer = res.data;
        setFooter(res.data.footer);
        // console.log("footer",res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const newsletterSubscribe = (values) => {
    axios
      .post(
        process.env.REACT_APP_BACKEND_HOST + "/storefront/newsletter",
        values
      )
      .then((response) => {
        setEmailSend(true);

        setTimeout(() => {
          setEmailSend(false);
        }, 3000);
      })
      .catch((err) => {
        console.log("Email Subscription Error: ", err);
      });
  };

  return (
    <>
      <div
        className="footer-wrapper"
        style={{ backgroundColor: footer ? footer.background_color : null }}
      >
        <div className="footer-top">
          <div className="container-xl">
            <div className="footer-top-row">
              <div className="footer-logo-wrapper footer-top-col">
                <div>
                  <div className="footer-logo">
                    <Link to="/">
                      <img
                        src={footer ? footer.footer_logo.logo_image : null}
                        alt="Comverse Footer Logo"
                      />
                    </Link>
                  </div>
                  <div className="footer-contact-info">
                    <div>
                      <svg
                        width="33"
                        height="35"
                        viewBox="0 0 33 35"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M31.3119 17.3229L30.5416 16.9327C30.5472 16.3704 30.5388 15.8597 30.5416 15.3789C30.5416 12.905 29.9275 10.475 28.7632 8.32616C29.0353 7.92065 29.0488 7.3796 28.7728 6.95283C27.7496 5.37056 26.4658 4.01425 24.9571 2.92151C23.9689 2.20583 22.8988 1.61791 21.7766 1.17399C21.5277 1.07554 21.2487 1.20423 21.1534 1.46136C21.0582 1.71856 21.1827 2.0068 21.4315 2.10525C22.48 2.51993 23.4798 3.06929 24.4032 3.73811C25.8136 4.75971 27.0139 6.02774 27.9704 7.5069C28.0308 7.60017 28.0166 7.72302 27.9369 7.799C27.8638 7.85883 26.2524 9.42521 26.155 9.48617C26.106 9.51149 26.0587 9.51089 26.0308 9.50704C25.9915 9.50152 25.9181 9.47992 25.8683 9.39709C25.2348 8.34497 24.4439 7.41085 23.5175 6.62051C21.5551 4.94638 19.0741 4.02435 16.5315 4.02435C13.8578 4.02435 11.2794 5.03226 9.27104 6.86248C8.48054 7.58282 7.79502 8.41417 7.2334 9.33327C7.18702 9.40912 7.11677 9.4278 7.07894 9.43212C7.03938 9.43677 6.96334 9.43431 6.89797 9.36671L5.22271 7.63554C5.14809 7.55836 5.1376 7.43677 5.19781 7.3463C5.9081 6.27969 6.75593 5.31685 7.71775 4.4845C10.1858 2.34902 13.3159 1.17292 16.5315 1.17292C17.416 1.17292 18.301 1.26067 19.1621 1.43378C19.4236 1.48636 19.6769 1.30986 19.7278 1.03957C19.7787 0.76928 19.6079 0.507564 19.3463 0.454981C18.4247 0.269712 17.4777 0.175781 16.5315 0.175781C13.0898 0.175781 9.73964 1.43457 7.09824 3.72016C6.06951 4.61041 5.16262 5.64032 4.40287 6.78118C4.11189 7.2182 4.12991 7.79129 4.42886 8.20577C3.94971 9.05507 3.55395 9.95024 3.2512 10.8723C3.16557 11.133 3.3008 11.4162 3.55311 11.5046C3.60451 11.5227 3.65675 11.5312 3.70815 11.5312C3.90919 11.5312 4.09684 11.4003 4.16503 11.1927C4.4185 10.4207 4.74286 9.66911 5.13001 8.94997L6.16035 10.0147C5.34205 11.7069 4.9107 13.5908 4.9107 15.491V25.8708L2.24627 24.5209C1.9324 24.3619 1.72956 24.0258 1.72956 23.6646V19.0746C1.72956 18.7133 1.9324 18.3772 2.24627 18.2182C2.40916 18.1282 2.73783 17.9801 3.00983 17.8312C3.30382 17.6682 3.48646 17.3528 3.48646 17.0078V15.4969C3.48299 14.8554 3.52583 14.2078 3.61377 13.5724C3.65154 13.2998 3.46826 13.0472 3.20449 13.0083C2.94106 12.9692 2.69634 13.1586 2.65858 13.4312C2.56388 14.1151 2.51782 14.812 2.52148 15.4997V16.9701C2.4008 17.039 1.99988 17.2262 1.80393 17.3319C1.17193 17.6607 0.764648 18.3425 0.764648 19.0746V23.6646C0.764648 24.4034 1.17952 25.091 1.82149 25.4163L5.03988 27.0468C5.37814 28.1075 6.34556 28.8755 7.48391 28.8755C8.90275 28.8755 10.057 27.6828 10.057 26.2167V17.2487C10.057 15.7826 8.90275 14.5898 7.48391 14.5898C6.87803 14.5898 6.32079 14.8078 5.88063 15.1713C5.92618 13.5232 6.32285 11.8975 7.03764 10.4304C7.08685 10.431 7.13632 10.4289 7.18605 10.4231C7.54342 10.3819 7.85813 10.1787 8.04945 9.86554C8.56198 9.02668 9.1878 8.26786 9.90941 7.61027C11.7413 5.94086 14.0931 5.02143 16.5315 5.02143C18.8505 5.02143 21.1133 5.86235 22.9032 7.38937C23.7488 8.11084 24.4708 8.96346 25.0489 9.92371C25.2379 10.2375 25.5486 10.4457 25.9014 10.4951C25.9547 10.5025 26.0079 10.5062 26.0609 10.5062C26.0842 10.5062 26.1072 10.5042 26.1303 10.5029C26.823 11.9505 27.208 13.5508 27.2528 15.1713C26.8126 14.8078 26.2554 14.5897 25.6495 14.5897C24.2306 14.5897 23.0763 15.7825 23.0763 17.2487V18.7439C23.0763 19.0192 23.2923 19.2425 23.5588 19.2425C23.8253 19.2425 24.0413 19.0192 24.0413 18.7439V17.2487C24.0413 16.3323 24.7627 15.5869 25.6495 15.5869C26.5362 15.5869 27.2576 16.3323 27.2576 17.2487V26.2166C27.2576 27.1329 26.5362 27.8783 25.6495 27.8783C24.7627 27.8783 24.0413 27.1329 24.0413 26.2166V21.2578C24.0413 20.9824 23.8253 20.7592 23.5588 20.7592C23.2923 20.7592 23.0763 20.9824 23.0763 21.2578V26.2166C23.0763 27.6827 24.2306 28.8755 25.6495 28.8755C26.2576 28.8755 26.8167 28.6559 27.2576 28.29V29.4777C27.2576 29.8364 26.9751 30.1283 26.628 30.1283H20.8471C20.6968 29.6683 20.2761 29.3359 19.781 29.3359H16.1327C15.5119 29.3359 15.0069 29.8578 15.0069 30.4992V33.0482C15.0069 33.6897 15.5119 34.2116 16.1327 34.2116H19.781C20.2744 34.2116 20.6938 33.8813 20.8454 33.4238H23.9779C24.2444 33.4238 24.4604 33.2006 24.4604 32.9253C24.4604 32.6499 24.2444 32.4267 23.9779 32.4267H20.9068V31.1255H26.628C27.5072 31.1255 28.2226 30.3863 28.2226 29.4777V26.9813L29.4818 26.3434V30.7706C29.4818 31.6837 28.7629 32.4267 27.8791 32.4267H26.3848C26.1184 32.4267 25.9023 32.6499 25.9023 32.9253C25.9023 33.2006 26.1184 33.4238 26.3848 33.4238H27.8791C29.2949 33.4238 30.4468 32.2336 30.4468 30.7706V25.8545L31.3119 25.4163C31.9538 25.091 32.3687 24.4035 32.3687 23.6646V19.0746C32.3687 18.3357 31.9538 17.6482 31.3119 17.3229ZM7.48384 15.587C8.37059 15.587 9.09201 16.3325 9.09201 17.2488V26.2168C9.09201 27.133 8.37059 27.8785 7.48384 27.8785C6.5971 27.8785 5.87568 27.133 5.87568 26.2168V17.2487C5.87568 16.3324 6.5971 15.587 7.48384 15.587ZM15.9718 33.0482V30.4993C15.9718 30.4077 16.044 30.3332 16.1326 30.3332H17.4742V33.2144H16.1326C16.044 33.2144 15.9718 33.1398 15.9718 33.0482ZM19.9418 33.0482C19.9418 33.1398 19.8696 33.2144 19.7809 33.2144H18.4393V30.3332H19.7809C19.8696 30.3332 19.9418 30.4077 19.9418 30.4993V33.0482ZM31.4037 23.6647C31.4037 24.0259 31.2009 24.362 30.887 24.521L28.2226 25.8709C28.2226 24.5993 28.2226 16.5265 28.2226 15.491C28.2226 13.607 27.7982 11.737 26.993 10.0559L28.047 9.05081C29.0478 10.989 29.5751 13.1603 29.5767 15.3696C29.5732 15.7836 29.5828 16.3389 29.576 17.0081C29.573 17.3381 29.7561 17.6452 30.0427 17.7905L30.8871 18.2183C31.201 18.3773 31.4038 18.7134 31.4038 19.0746V23.6647H31.4037Z"
                          fill="white"
                        />
                        <path
                          d="M20.9059 15.5679C20.8711 15.1365 20.6277 14.7869 20.2857 14.6774C20.1246 14.6258 19.7072 14.56 19.3117 15.0615C18.9439 15.5279 17.0957 18.9781 16.729 19.665C16.6465 19.8194 16.6492 20.0074 16.7359 20.1593C16.8227 20.3112 16.9807 20.4044 17.1514 20.4044H19.9374C19.9338 20.9334 19.9299 21.4438 19.9262 21.8968C19.9238 22.1722 20.138 22.3973 20.4045 22.3996H20.4087C20.6732 22.3996 20.8888 22.1793 20.8911 21.9053C20.8926 21.7283 20.8973 21.1478 20.9025 20.4044H21.2598C21.5262 20.4044 21.7422 20.1811 21.7422 19.9058C21.7422 19.6304 21.5262 19.4072 21.2598 19.4072H20.9089C20.9189 17.7337 20.9256 15.8119 20.9059 15.5679ZM19.9439 19.4073H17.9707C18.6952 18.0628 19.6019 16.4109 19.9501 15.8547C19.9577 16.4019 19.9528 17.8824 19.9439 19.4073Z"
                          fill="white"
                        />
                        <path
                          d="M15.9497 21.9475C15.9463 21.6721 15.7302 21.4535 15.4611 21.4552C14.5822 21.4666 13.6403 21.473 12.9954 21.4701C13.3576 20.9779 13.9501 20.1611 14.8573 18.8216C15.2952 18.15 15.6289 17.5151 15.6723 16.8065C15.6723 15.5778 14.7049 14.5781 13.5158 14.5781C12.4876 14.5781 11.5977 15.3339 11.3998 16.3752C11.3484 16.6453 11.5188 16.9074 11.7802 16.9605C12.0417 17.0134 12.2953 16.8375 12.3467 16.5674C12.4559 15.9925 12.9476 15.5753 13.5158 15.5753C14.1634 15.5753 14.692 16.1119 14.7071 16.7774C14.6703 17.2267 14.4321 17.6847 14.0666 18.2498C13.0273 19.7842 12.4069 20.6238 12.0735 21.0748C11.6771 21.6112 11.5575 21.773 11.6447 22.0662C11.6941 22.232 11.8166 22.3596 11.9807 22.4161C12.3164 22.5092 14.3862 22.4573 15.4732 22.4522C15.7397 22.4488 15.953 22.2228 15.9497 21.9475Z"
                          fill="white"
                        />
                      </svg>
                    </div>

                    <div className="contact-info">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: footer ? footer.contact_information : null,
                        }}
                      ></div>

                      <p className="k-row1">
                        {footer ? footer.phone_number : null}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="socialmedia-links">
                  <a href="https://www.facebook.com">
                    {/* <FacebookOutlined /> */}
                    <TwitterOutlined />
                    {/* <Icon name="facebook f" /> */}
                  </a>
                  <a href="https://www.instagram.com">
                    <InstagramOutlined />
                    {/* <Icon name="instagram" /> */}
                  </a>
                  {/* <a href="/">
                      <Icon name="twitter" />
                    </a> */}
                  <a href="https://www.linkedin.com">
                    <LinkedinOutlined />
                    {/* <Icon name="linkedin alternate" /> */}
                  </a>
                </div>
              </div>
              <div className="footer-nav footer-top-col">
                <h3 className="footer-sec-heading">
                  {footer ? footer.navigations[0].title : null}
                </h3>
                <ul className="footer-nav">
                  {footer?.navigations[0]?.menu.map((item, key) => (
                    <li
                      key={key}
                      style={{
                        color: footer ? footer.text_color.opacity : null,
                      }}
                    >
                      <Link to={item.link}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="footer-nav footer-top-col right">
                <h3 className="footer-sec-heading">
                  {footer ? footer.navigations[1]?.title : null}
                </h3>
                <ul className="footer-nav">
                  {footer?.navigations[1]?.menu.map((item, key) => (
                    <li
                      key={key}
                      style={{
                        color: footer ? footer.text_color.opacity : null,
                      }}
                    >
                      <Link to={item.link}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="footer-newsletter footer-top-col">
                {footer?.show_news_letter ? (
                  <>
                    <h3 className="footer-sec-heading">Subscribe Us </h3>
                    <p className="footer-para">
                      We don't send spam so don't worry
                    </p>

                    <Formik
                      initialValues={{
                        email: "",
                      }}
                      validationSchema={Yup.object().shape({
                        email: Yup.string()
                          .email("Invalid email")
                          .required("Required"),
                      })}
                      onSubmit={(values) => {
                        newsletterSubscribe(values);
                      }}
                    >
                      {({ errors, touched }) => (
                        <Form>
                          <div className="form">
                            <Field
                              name="email"
                              type="email"
                              placeholder="Email"
                              required
                              className={` ${
                                touched.email && errors.email && "invalid"
                              } `}
                            />
                            {/* {errors.email && touched.email ? (
                              
                            {   element = document.getElementById('footer-mail')}
                            element.style.color = 'red';
                            ) : null} */}
                            <button type="submit">
                              <HiOutlineMail
                                type="submit"
                                //style={{ color: '#203348' }}
                              />
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                    {emailSend ? (
                      <p className="info">Email Subscribed</p>
                    ) : null}
                  </>
                ) : null}
                {/* <div className="theqa-logo">
                  <div>
                    <a href="https://theqa.qa/certificates/details/f11cd127-ef14-4366-afdd-441ef7f1f11f">
                      <img
                        src="https://theqa.qa/badge/f11cd127-ef14-4366-afdd-441ef7f1f11f.svg"
                        alt="trustmark-badge"
                        width="200"
                      />
                    </a>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container-xl">
            <div className="footer-bottom-inner">
              <div className="copyright-wrapper">
                <p>
                  &copy;
                  <a
                    href="https://comverseglobal.com/"
                    target="blank"
                    id="footer-comverse"
                  >
                    2022 COMVERSE. All Right Reserved.
                  </a>
                </p>
              </div>
              <div className="socialmedia-links">
                <a href="https://www.facebook.com/">
                  <TwitterOutlined />
                </a>
                <a href="https://www.instagram.com/">
                  <InstagramOutlined />
                </a>

                <Link to="https://www.linkedin.com/">
                  <LinkedinOutlined />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
