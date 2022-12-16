import moment from "moment";
import { Rate } from "antd";
import { Collapse } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, TextArea, message, Form, Input } from "antd";
import "./ReveiwsSection.scss";
import { Pagination } from "antd";
import Avatar from "../../../assets/img/avatar.png";
import { productReviewd } from "../../../redux/slices/productPageSlice";

function ReveiwsSection() {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [review, setreview] = useState();
  const { TextArea } = Input;
  const [commentsection, setcommentsection] = useState(false);
  const login = useSelector((state) => state.account.loggedIn);
  const id = useSelector((state) => state.productPage.productId);
  const is_reveiw = useSelector((state) => state.productPage.productis_reveiw);
  const customer_id = parseInt(sessionStorage.getItem("comverse_customer_id"));
  const [current, setCurrent] = useState(3);

  const onChange = (no) => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_HOST +
          `/storefront/product_review_list?handle=` +
          product_handle +
          "&limit=2" +
          "&page=" +
          no
      )
      .then((res) => {
        setreview(res?.data?.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const product_handle = useSelector(
    (state) => state.productPage.productHandle
  );
  useEffect(() => {
    all_comments();
  }, [commentsection, is_reveiw]);

  const all_comments = () => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_HOST +
          `/storefront/product_review_list?handle=` +
          product_handle +
          "&limit=2" +
          "&page=1"
      )
      .then((res) => {
        setreview(res?.data?.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // For the slective comments
  const fetch_comments = () => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_HOST +
          `/storefront/product/` +
          product_handle +
          "?customer_id=" +
          customer_id +
          "?limit=3" +
          "&page=1"
      )
      .then((res) => {
        setreview(res?.data?.reviews);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onFinish = (values) => {
    let body = {
      product: id,
      customer: customer_id,
      comment: values.message,
      rating: values.rate,
    };

    axios
      .post(
        process.env.REACT_APP_BACKEND_HOST + "/storefront/product_review",
        body,
        {
          headers: {
            pushpa: sessionStorage.getItem("comverse_customer_token"),
          },
        }
      )
      .then((response) => {
        success(response.data.detail);
      })
      .catch((err) => {
        console.log(err);
        error(err.data.detail);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const error = (err) => {
    message.error(err);
  };
  const success = (err1) => {
    dispatch(productReviewd(true));
    all_comments();
    message.success(err1);
  };
  const { Panel } = Collapse;
  return (
    <>
      <div>
        {review?.map((pro,index) => {
          return (
            <>
              <div className="customer-reviews" key={index}>
                <div className="review-comments">
                  <div className="avatar-name">
                    {/* <img src={Avatar} alt="" /> */}
                    <h3>{pro?.customer_name}</h3>
                  </div>
                  <div className="rateing">
                    <Rate
                    required
                      size="sm"
                      value={pro?.rating}
                      style={{ fontSize: 36 }}
                    />
                  </div>
                </div>

                <p className="reveiw-comment">{pro?.comment}</p>
              </div>
            </>
          );
        })}
        {review == "" ? null : (
          <Pagination
            defaultCurrent={1}
            total={50}
            onChange={(e) => onChange(e)}
            // style={{ textAlign: "center" }}
            className="reveiw-pagination"
          />
        )}

        {!is_reveiw ? (
          <div>
            <button
              onClick={() => setcommentsection(true)}
              className="post-comment"
            >
              Post a Comment
            </button>
            {commentsection ? (
              login ? (
                <div className="comment-form">
                  <Form
                    name="basic"
                    labelCol={{
                      span: 8,
                    }}
                    wrapperCol={{
                      span: 16,
                    }}
                    initialValues={{
                      remember: false,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                  >
                    <Form.Item
                      wrapperCol={{
                        offset: 8,
                        span: 16,
                      }}
                    >
                      <Form.Item name="rate" label="Rate" className="rate">
                        <Rate />
                      </Form.Item>
                      <h3>Enter Message</h3>
                      <Form.Item
                        // label="Enter Message"
                        style={{ width: "100%" }}
                        type="textbox"
                        name="message"
                        rules={[
                          {
                            required: true,
                            message: "Enter Your Message!",
                          },
                        ]}
                      >
                        <TextArea rows={4} />
                      </Form.Item>
                      <Button
                        // type="primary"
                        htmlType="submit"
                        className="comment-button"
                      >
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              ) : (
                navigate("/signup")
              )
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
}

export default ReveiwsSection;
