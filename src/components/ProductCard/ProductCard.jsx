import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import defaultImage from "../../assets/img/productImagePlaceholder.png";
import "./ProductCard.scss";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Button, Badge } from "antd";

export const ProductCard = (props) => {
  //console.log('props from product card', props)

  const [wishList, setWishList] = useState([]);
  const [wishListStyle, setWishListStyle] = useState(<HeartOutlined />);
  const [product, setProduct] = useState(props?.product);
  const defaultCurrency = useSelector(
    (state) => state.multiLocation.defaultCurrency
  );

  const defaultCountry = useSelector(
    (state) => state.multiLocation.defaultCountry
  );
  // const currency = useSelector((state) => state.currency);
  // console.log("product", product);

  useEffect(() => {
    // debugger;
    changeColor();
  }, [props?.product, defaultCountry]);

  const changeColor = () => {
    // let product = product;
    if (localStorage.getItem("wishList")) {
      let wishlistObj = JSON.parse(localStorage.getItem("wishList"));
      let doesExist = false;
      let i = 0;
      for (i; i < wishlistObj?.length; i++) {
        if (wishlistObj[i].variant_id == product?.variant_detail?.variant_id) {
          doesExist = true;
          break;
        }
      }
      if (doesExist) {
        setWishListStyle(<HeartFilled style={{ color: "teal" }} />);
      } else {
        setWishListStyle(<HeartOutlined />);
      }
    }
  };

  const productClicks = (productObj) => {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    window.dataLayer.push({
      event: "productClick",
      ecommerce: {
        click: {
          products: [
            {
              name: productObj.name, // Name or ID is required.
              id: productObj.id,
              price: productObj.price,
              brand: productObj.brand,
              category: productObj.cat,
              variant: productObj.variant,
              position: productObj.position,
            },
          ],
        },
      },
    });
  };

  const deleteWishList = (variantID) => {
    let doesExist = false;
    let i = 0;
    let wishlist = JSON.parse(localStorage.getItem("wishList"));
    if (localStorage.getItem("wishList")) {
      for (i; i < wishlist?.length; i++) {
        if (wishlist[i].variant_id == variantID) {
          doesExist = true;
          break;
        }
      }
    }

    axios
      .delete(
        process.env.REACT_APP_BACKEND_HOST +
          "/storefront/wishlist?variiant_id=" +
          variantID,
        {
          headers: {
            pushpa: sessionStorage.getItem("comverse_customer_token"),
          },
        }
      )
      .then((response) => {
        if (doesExist) {
          wishlist.splice(i, 1);
          localStorage.setItem("wishList", JSON.stringify(wishlist));
          setWishList(wishlist);
        }
      });
  };

  const postWishList = (variant_id) => {
    let i = 0;
    let doesExist = false;
    for (i; i < wishList.length; i++) {
      if (
        wishList.product_data.variant_id === product?.variant_detail?.variant_id
      ) {
        doesExist = true;
        break;
      }
    }

    if (!doesExist) {
      axios
        .post(
          process.env.REACT_APP_BACKEND_HOST + "/storefront/wishlist",
          variant_id,
          {
            headers: {
              pushpa: sessionStorage.getItem("comverse_customer_token"),
            },
          }
        )
        .then((response) => {});
    }
  };

  const addToWishList = (event) => {
    // debugger;
    event.preventDefault();
    //let product = product
    let variant_id = {
      variant_id: product?.variant_detail?.variant_id,
    };
    if (sessionStorage.getItem("comverse_customer_token")) {
      let wishlistObj = JSON.parse(localStorage.getItem("wishList"));
      let doesExist = false;
      let singleProductDetail = [];
      let productImg = product?.image?.length ? product?.image : null;
      let sku = product?.variant_detail ? product?.variant_detail?.sku : "";
      let productDetail = {
        title: product?.title,
        image: productImg,
        variant_id: product?.variant_detail?.variant_id,
        product_handle: product?.handle,
        variant_price: product?.variant_detail?.original_price,
        sku: sku,
      };
      singleProductDetail.push(productDetail);
      if (wishlistObj) {
        let i = 0;
        for (i; i < wishlistObj?.length; i++) {
          if (wishlistObj[i].variant_id == productDetail?.variant_id) {
            doesExist = true;
            break;
          }
        }
        if (!doesExist) {
          wishlistObj.push(productDetail);
          postWishList(variant_id);
        } else {
          doesExist = false;
          wishlistObj.splice(i, 1);
          deleteWishList(product?.variant_detail?.variant_id);
        }
        localStorage.setItem("wishList", JSON.stringify(wishlistObj));
      } else {
        localStorage.setItem("wishList", JSON.stringify(singleProductDetail));
      }
    } else {
      let wishlistObj = JSON.parse(localStorage.getItem("wishList"));
      let doesExist = false;
      let singleProductDetail = [];
      let productImg = product?.image.length ? product?.image : null;
      let sku = product?.variant_detail ? product?.variant_detail?.sku : "";
      let productDetail = {
        title: product?.title,
        image: productImg,
        variant_id: product?.variant_detail.variant_id,
        product_handle: product?.handle,
        variant_price: product?.variant_detail.original_price,
        sku: sku,
      };
      singleProductDetail.push(productDetail);
      if (wishlistObj) {
        let i = 0;
        for (i; i < wishlistObj.length; i++) {
          if (wishlistObj[i].variant_id == productDetail.variant_id) {
            doesExist = true;
            break;
          }
        }
        if (!doesExist) {
          wishlistObj.push(productDetail);
        } else {
          doesExist = false;
          wishlistObj.splice(i, 1);
        }
        localStorage.setItem("wishList", JSON.stringify(wishlistObj));
      } else {
        localStorage.setItem("wishList", JSON.stringify(singleProductDetail));
      }
    }

    changeColor();
  };

  let saleTag = null;
  let price = (
    <p className="product-price">
      {product?.variant_detail
        ? product?.variant_detail?.currency
        : defaultCurrency}
      :{product?.variant_detail?.original_price}
    </p>
  );
  if (product?.price?.original_price < product?.variant_detail?.compare_price) {
    saleTag = <div>Sale</div>;
    price = (
      <p className="product-price sale-price">
        <span className="original-price">
          {product?.variant_detail?.currency}:
          {product?.variant_detail?.compare_price}
        </span>
        {product?.variant_detail?.currency}:
        {product?.variant_detail?.original_price}
      </p>
    );
  }
  // if(product.sold_out == true) {
  //   soldTag = (
  //     <div className="soldTag">sold</div>
  //   )
  // }

  let productObjectGA = {
    name: product?.title, // Name or ID is required.
    id: product?.id,
    price: product?.variant_detail?.original_price,
    // 'brand': ,
    // 'category': productObj.cat,
    // 'variant': productObj.variant,
    // 'position': productObj.position
  };

  return (
    <>
      <div className="product-wrapper product-grid-item">
        <Link to={"/product/" + product?.handle}>
          <div
            onClick={() => {
              productClicks(productObjectGA);
            }}
            className="product-card-inner-wrapper"
          >
            <div className="upper-wrapper">
              {saleTag !== null ? (
                <div className="sale-tag">
                  <Badge.Ribbon placement="end" text={saleTag} color="teal" />
                </div>
              ) : null}

              {product?.sold_out == true ? (
                <div className="sold-tag">
                  <span>sold out</span>
                </div>
              ) : null}

              <div
                className="wishlist-btn-heart"
                onClick={(e) => {
                  addToWishList(e);
                  changeColor();
                  //console.log(product, 'color:red')
                }}
              >
                {wishListStyle}
              </div>
            </div>

            <div className="grid-item-image">
              <img
                className="product-img"
                src={product?.image ? product?.image : defaultImage}
                alt={product?.title}
              />
            </div>

            <p className="product-title">{product?.title}</p>
            {price}
            <Button className="btn-1">Buy It Now</Button>
          </div>
        </Link>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
