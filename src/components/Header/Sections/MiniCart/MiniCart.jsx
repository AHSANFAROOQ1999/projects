import React, { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Update_minicart } from "../../../../redux/slices/cartSlice";
import { Badge } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import "./MiniCart.scss";

export const MiniCart = (props) => {
  const dispatch = useDispatch();

  const currency = useSelector((state) => state.multiLocation.defaultCurrency);
  const totalAmount = useSelector((state) => state.cart.totalprice);
  const totalProducts = useSelector((state) => state.cart.totalCount);

  useEffect(() => {
    updateCart();
  }, []);

  const updateCart = () => {
    dispatch(Update_minicart());
  };

  return (
    <>
      <div className="micicart cart-icon k-row">
        <div className=" k-row">
          <Link className="cart-link" to="/cart">
            <Badge count={totalProducts} overflowCount={10}>
              <ShoppingOutlined alt="Cart" style={{ fontSize: "22px" }} />
            </Badge>
          </Link>

          <Link to="/cart">
            <p id="cart-total">
              <span>
                <span className="cart-total-quantity">
                  {totalAmount > 0 ? totalAmount + " " + currency : ""}
                </span>
              </span>
            </p>
          </Link>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MiniCart);
