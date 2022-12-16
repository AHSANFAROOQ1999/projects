import { Button, Input } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import dummyBrandImage from "../../../src/assets/img/placeholderBrand.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { SearchOutlined } from "@ant-design/icons";
// import debounce from 'lodash/debounce';
import Helmet from "react-helmet";

import "./BrandsPage.scss";

export const BrandsPage = (props) => {
  const [query, setQuery] = useState("");
  const [brands, setBrands] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [brandsLimit, setBrandsLimit] = useState(35);
  const [showLoader, setShowLoader] = useState(true);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [totalBrandsToPaginate, setTotalBrandsToPaginate] = useState(null);

  const { Search } = Input;

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = () => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_HOST +
          `/storefront/brand_list?limit=${brandsLimit}&page=${activePage}&search=${query}   `
      )
      .then((response) => {
        setShowLoader(false);
        setActivePage(activePage + 1);
        setTotalBrandsToPaginate(response.data.count);
        setBrands(brands.concat(response.data.results));
        setHasMoreData(response.data.next ? true : false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const searchBrand = () => {
    setActivePage(1);
    setBrands([]);
    fetchBrands();
  };

  const onInputchange = (event) => {
    setQuery(event.target.value);

    // const debouncedSearch = debounce(() => searchBrand(), 3000);
    // debouncedSearch();
  };

  return (
    <>
      <div className="brands-page">
        <Helmet>
          <title>Shop By Brands | COMVERSE</title>
          <meta name="description" content="" />
          <meta name="keyword" content="" />
        </Helmet>
        <div className="container-xl">
          <h1>Shop By Brands</h1>

          <div className="brand-search">
            <div className="ui input">
              {/* <Input
                type="text"
                value={query}
                onChange={onInputchange}
                placeholder="Search brands..."
                onPressEnter={searchBrand}
              /> */}
              <Search
                onChange={onInputchange}
                placeholder="Search brands..."
                allowClear
                onSearch={searchBrand}
                style={{ width: 200 }}
                onPressEnter={searchBrand}
              />
              {/* <SearchOutlined className="search-btn" onClick={searchBrand} /> */}
              {/* <Button className="search-btn" onClick={searchBrand}>
              </Button> */}
              {/* <Icon name={"search"} /> */}
            </div>
          </div>

          <InfiniteScroll
            dataLength={brands?.length}
            next={fetchBrands}
            hasMore={hasMoreData}
            loader={<Loader active inline="centered" />}
            endMessage={
              <p>
                <b>No More Brands</b>
              </p>
            }
          >
            <div className="brands-wrapper">
              {brands.length
                ? brands.map((brand, key) => {
                    return (
                      <div className="brand-card" key={key}>
                        <div>
                          <Link to={"/brand/" + brand.handle}>
                            <img
                              src={
                                brand?.image
                                  ? brand.image.cdn_link
                                  : dummyBrandImage
                              }
                              alt={brand.name}
                            />
                            <h4>{brand.name}</h4>
                          </Link>
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          </InfiniteScroll>

          {/* <div className="pagination-wrapper">
            {
              totalBrandsToPaginate > brandsLimit ?
                <Pagination
                  className="site-pagination"
                  activePage={activePage}
                  onPageChange={this.handlePaginationChange}
                  totalPages={Math.ceil(totalBrandsToPaginate / brandsLimit)}
                  firstItem={null}
                  lastItem={null}

                />
                : null
            }
          </div> */}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BrandsPage);
