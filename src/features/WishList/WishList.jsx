import axios from "axios";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Table, Typography, Button } from "antd";
import "./WishList.scss";

function WishList() {
  const { Text } = Typography;
  const currency = useSelector((state) => state.multiLocation.defaultCurrency);
  const [wishList, setWishList] = useState(
    localStorage.getItem("wishList")
      ? JSON.parse(localStorage.getItem("wishList"))
      : []
  );

  const [wishListEmpty, setwishListEmpty] = useState(false);
  const defaultCountry = useSelector(
    (state) => state.multiLocation.defaultCountry
  );

  useEffect(() => {
    // debugger;
    if (!localStorage.getItem("wishList")) {
      setwishListEmpty(true);
      setWishList([]);
    }
    // localStorage.removeItem("wishList");
  }, [defaultCountry]);

  const deleteWishList = (variantID) => {
    // console.log("variantID : ", variantID);
    //debugger
    let doesExist = false;
    let i = 0;
    let wishlist = JSON.parse(localStorage.getItem("wishList"));
    if (localStorage.getItem("wishList")) {
      for (i; i < wishlist.length; i++) {
        if (wishlist[i].variant_id == variantID) {
          doesExist = true;
          break;
        }
      }
    }
    if (sessionStorage.getItem("comverse_customer_token")) {
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

            if (!wishlist.length) {
              setwishListEmpty(true);
            } else {
              setwishListEmpty(false);
            }
          }
        });
    } else {
      if (doesExist) {
        wishlist.splice(i, 1);
        localStorage.setItem("wishList", JSON.stringify(wishlist));
        setWishList(wishlist);

        if (!wishlist.length) {
          setwishListEmpty(true);
        } else {
          setwishListEmpty(false);
        }
      }
    }
  };

  const columns = [
    {
      // title: "Product",
      dataIndex: "image",
      key: "image",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "Product",
      dataIndex: "title",
      key: "title",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "Price",
      dataIndex: "variantPrice",
      key: "variantPrice",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Remove",
      dataIndex: "remove",
      key: "remove",
      // render: (text) => <a>{text}</a>,
    },
  ];

  // console.log(wishList)
  var table = [];
  for (var i = 0; i < wishList?.length; i++) {
    let variant_id = wishList[i].variant_id;
    table[i] = {
      key: i,
      image: (
        <img src={wishList[i]?.image} width="50px" alt={wishList[i]?.title} />
      ),
      title: wishList[i]?.title,

      // variantPrice: wishList[i]?.variant_price,
      variantPrice: (
        <>
          <Text strong>{currency + " " + wishList[i]?.variant_price}</Text>
        </>
      ),

      sku: wishList[i]?.sku,
      remove: (
        <Button
          danger
          className="remove"
          onClick={() => {
            deleteWishList(variant_id);
          }}
        >
          Remove
        </Button>
      ),
    };
  }
  // console.log("title", table);

  return (
    <>
      <div className="wish-list-page">
        <Helmet>
          <title>WishList | COMVERSE</title>
          <meta name="description" content="" />
          <meta name="keyword" content="" />
        </Helmet>
        <div className="container-xl">
          <div className="breadcrumbs">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/">Home</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/wishlist">WishList </Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="wish-list-wrapper">
            <Table
              columns={columns}
              dataSource={table}
              pagination={table.length > 10 ? true : false}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default WishList;
