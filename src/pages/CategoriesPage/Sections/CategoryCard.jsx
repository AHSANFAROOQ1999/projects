import { Button } from "antd";
import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import categoryImage from "../../../assets/img/unnamed1.png";
import "./CategoryCard.scss";

export const CategoryCard = (props) => {
  const firstRender = useRef(true);
  const style = { backgroundColor: props.color };

  useEffect(() => {
    firstRender.current = false;

    if (firstRender) {
    }
  }, [props.cat]);

  return (
    <>
      <div className="category-card">
        <div style={style}>
          <div>
            <h4>{props?.cat?.name}</h4>
          </div>
          <div>
            <Link to={"/collection/" + props?.cat?.handle}>
              <Button className="cat-button">Shop Now</Button>
            </Link>
          </div>
          <div className="cat-card-img">
            <div className="white-bg"></div>
            <img
              src={
                props?.cat?.image.cdn_link
                  ? props?.cat?.image.cdn_link
                  : categoryImage
              }
              alt={props?.cat?.name}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryCard);
