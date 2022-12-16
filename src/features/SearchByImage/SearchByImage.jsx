import { Button, Modal } from "antd";
import React, { useState, createRef } from "react";
import { useEffect } from "react";
import { flushSync } from "react-dom";
import axios from "axios";
import Model from "./Model";
import { Collapse, Checkbox } from "antd";
import "./SearchByImage.scss";

const { Panel } = Collapse;

const SearchByImage = (props) => {
  console.log(props, "props");
  const imageRef = createRef();
  //   const [isModalVisible, setIsModalVisible] = useState(props.showModal);
  let isModalVisible = props.showModal;
  const [boundingBox, setboundingBox] = useState([]);
  const [tags, settags] = useState([]);
  const [selectedFile, setselectedFile] = useState(null);
  const [imageHeight, setimageHeight] = useState(0);
  const [imageWidth, setimageWidth] = useState(0);
  console.log(isModalVisible, "isModalVisible");
  let filterTags = "";
  //   const showModal = () => {
  //     setIsModalVisible(true);
  //   };

  useEffect(() => {
    imageRef?.current?.addEventListener("load", setSpans);
  }, []);
  const setSpans = () => {
    setimageHeight(imageRef?.current?.naturalHeight);
    setimageWidth(imageRef?.current?.naturalWidth);
  };
  const handleOk = () => {
    setselectedFile(null);
    isModalVisible = false;
    console.log("ok");
    props.hideModal = false;
    // setIsModalVisible(false);
    debugger;
  };

  const handleCancel = () => {
    setselectedFile(null);
    isModalVisible = false;
    console.log("cancel");
    props.hideModal(false);
    debugger;
    // setIsModalVisible(false);
  };
  const getWidth = (values) => {
    let rightAdjust = values[2] - values[0];
    return (rightAdjust / imageWidth) * 100;
  };
  const getHeight = (values) => {
    let bottomAdjust = values[3] - values[1];
    return (bottomAdjust / imageHeight) * 100;
  };
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const onFileSelect = async (event) => {
    debugger;
    console.log("event", event);
    const file = event.target.files[0];
    const base64 = await convertBase64(file);
    setselectedFile(base64);
    submitHandler();
  };

  const submitHandler = (event) => {
    try {
      axios({
        method: "post",
        url: "https://3ryf8flqul.execute-api.us-east-1.amazonaws.com/default/XimilarAIFileUpload",
        headers: {
          "x-api-key": "PIDLW9oPBS9bSZtjxE5CdUwl0fOmzIv6bbNy4B3a",
          "Content-Type": "application/json",
        },

        data: {
          img64: selectedFile,
        },
      }).then((res) => {
        if (res.data.tag_list.length) {
          setboundingBox(res.data.tag_list);
          let data = res.data?.tag_list[0];
          getAllTagData(data?.sub_categories, data?.colors, data?.gender);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const switchHidden = (e) => {
    for (let i = 0; i < boundingBox.length; i++) {
      if (e.target.id == `divbtn${i}`) {
        getAllTagData(
          boundingBox[i]?.sub_categories,
          boundingBox[i]?.colors,
          boundingBox[i]?.gender
        );
        //to display:none btn clicked
        document.getElementById(e.target.id).classList.add("btn-style");
        document.getElementById(e.target.id).classList.remove("btn-style1");
        //to display:block divs
        document
          .getElementById(`div${e.target.id.slice(6, e.target.id.length)}`)
          .classList.add("mystyle1");
        document
          .getElementById(`div${e.target.id.slice(6, e.target.id.length)}`)
          .classList.remove("mystyle");
        document
          .getElementById(`tag-div${e.target.id.slice(6, e.target.id.length)}`)
          .classList.add("tags-style1");
        document
          .getElementById(`tag-div${e.target.id.slice(6, e.target.id.length)}`)
          .classList.remove("tags-style");
      } else {
        //display block remaining divs
        document.getElementById(`div${i}`).classList.add("mystyle");
        document.getElementById(`div${i}`).classList.remove("mystyle1");

        //display block remaining tags_divs
        document.getElementById(`tag-div${i}`).classList.add("tags-style");
        document.getElementById(`tag-div${i}`).classList.remove("tags-style1");

        //display block remaining btns
        document.getElementById(`divbtn${i}`).classList.add("btn-style1");
        document.getElementById(`divbtn${i}`).classList.remove("btn-style");
      }
    }
  };

  // getting all data of default checked checkboxes
  const getAllTagData = (subCategories, color, gender) => {
    filterTags = "";

    for (let i = 0; i < subCategories.length; i++) {
      filterTags = filterTags + subCategories[i] + "+";
    }

    for (let i = 0; i < color.length; i++) {
      filterTags = filterTags + color[i] + "+";
    }
    filterTags = filterTags + gender;

    axios
      .get(
        `https://staging-backend.comverseglobal.com/storefront/searchbyimage_product_list?tags=${filterTags}`
      )
      .then((res) => {
        settags(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onChange = (e) => {
    e.target.checked &&
      (filterTags = filterTags.concat(e.target.name).concat("+"));
    !e.target.checked && (filterTags = filterTags.split("+")); // making array on basis of "+"
    !e.target.checked &&
      filterTags.splice(filterTags.indexOf(e.target.name), 1); // find index and remove from array
    !e.target.checked && (filterTags = filterTags.join("+")); // concating array with "+"

    axios
      .get(
        `https://staging-backend.comverseglobal.com/storefront/searchbyimage_product_list?tags=${filterTags}`
      )
      .then((res) => {
        settags(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="main-container">
        <main className="container">
          {/* <Button type="primary" onClick={showModal}>
            Open Modal
          </Button> */}
          <Modal
            title="SHOPPING MATCHES"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            file={selectedFile}
          >
            <div
              className="head"
              style={{ display: selectedFile ? "block" : "none" }}
            >
              <h2>SHOPPING MATCHES</h2>
            </div>

            <div className="SBI_wrapper">
              <div className="SBI_tags_image">
                <div className="SBI_tags">
                  <h3
                    className="tags-heading"
                    style={{
                      display: selectedFile ? "block" : "none",
                    }}
                  >
                    Searching tags
                  </h3>

                  {boundingBox?.map((filter, index) => (
                    <div
                      id={`tag-div${index}`}
                      className={`tag-box ${
                        !index ? "tags-style1" : "tags-style"
                      }`}
                    >
                      <Collapse accordion>
                        {filter.sub_categories.length > 0 && (
                          <Panel header={filter.name} key="1">
                            <ul className="tag-list-ul">
                              {filter.sub_categories.map((sub_category) => (
                                <li>
                                  <Checkbox
                                    defaultChecked
                                    name={sub_category}
                                    onChange={onChange}
                                  ></Checkbox>
                                  {sub_category}
                                </li>
                              ))}
                            </ul>
                          </Panel>
                        )}
                        {filter.colors.length > 0 && (
                          <Panel header="Colors" key="2">
                            <ul className="tag-list-ul">
                              {filter.colors.map((colors) => (
                                <li>
                                  <Checkbox
                                    defaultChecked
                                    name={colors}
                                    onChange={onChange}
                                  ></Checkbox>
                                  {colors}
                                </li>
                              ))}
                            </ul>
                          </Panel>
                        )}
                        {filter.gender.length > 0 && (
                          <Panel header="Gender" key="3">
                            <Checkbox
                              defaultChecked
                              name={filter.gender[0]}
                              onChange={onChange}
                            ></Checkbox>
                            {""}
                            {filter.gender}
                          </Panel>
                        )}
                      </Collapse>
                    </div>
                  ))}
                </div>
                <div className="search-img">
                  <div className="search-img-div">
                    <img ref={imageRef} className="my-img" src={selectedFile} />

                    {boundingBox.length ? (
                      <>
                        {boundingBox.map((el, index) => (
                          <>
                            {console.log("el", el)}
                            <div
                              id={`div${index}`}
                              className={`bounding-box ${
                                !index ? "mystyle1" : "mystyle"
                              }`}
                              style={{
                                left: `${
                                  (el.bound_box[0] / imageWidth) * 100
                                }%`,
                                top: `${
                                  (el.bound_box[1] / imageHeight) * 100
                                }%`,
                                width: `${getWidth(el.bound_box)}%`,
                                height: `${getHeight(el.bound_box)}%`,
                              }}
                            >
                              {console.log(imageHeight, "imageHeight")}
                            </div>

                            <button
                              style={{
                                position: "absolute",

                                left: `${
                                  (el.bound_box[0] / imageWidth + 0.1) * 100
                                }%`,
                                top: `${
                                  (el.bound_box[1] / imageHeight) * 100
                                }%`,
                              }}
                              className={`${
                                !index ? "btn-style" : "btn-style1"
                              }`}
                              id={`divbtn${index}`}
                              onClick={switchHidden}
                            >
                              +
                            </button>
                          </>
                        ))}
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="SBI_products-list">
                {tags?.map((pro) => {
                  return (
                    <>
                      <div className="SBI_product-card">
                        <img
                          className="SBI_pro_img"
                          src={pro.image}
                          alt={pro.title}
                        />
                        <p className="para">{pro.title}</p>
                        <p className="pro_price">
                          <span className="SBI_original_price">
                            PKR {pro.price.original_price}
                          </span>
                          <span className="SBI_compare-price">
                            PKR {pro.price.compare_price}
                          </span>
                        </p>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>

            <form onSubmit={submitHandler}>
              <div
                className="upload"
                style={{
                  display: selectedFile ? "none" : "block",
                }}
              >
                <p>NEW!</p>
                <p className="para1">
                  Upload a picture, select the item and shop! You can even try
                  screenshots or photos from social media as inspiration
                </p>
                <input
                  type="file"
                  id="model-pic"
                  className="custom-file-input"
                  onChange={onFileSelect}
                  name="img64"
                />
                <br />
                <br />
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </>
  );
};

export default SearchByImage;
