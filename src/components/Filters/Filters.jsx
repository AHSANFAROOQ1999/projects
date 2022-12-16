import { connect } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import { Collapse, Input, Button, Col, Row, Checkbox } from "antd";

export const Filters = ({ allFilters, appendToUrl, clearFilters, onLoad }) => {
  const firstRender = useRef(true);
  const { Panel } = Collapse;

  let query = "";
  let defaultMin = "";
  let defaultMax = "";

  const [newMin, setNewMin] = useState("");
  const [newMax, setNewMax] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [onLoadQuery, setOnLoadQuery] = useState(onLoad.toString());

  let status = false;

  let tempSelectedFilters = allFilters.map((filter) => {
    return {
      type: filter.type,
      value: [],
    };
  });

  const [selectedFilters, setSelectedFilters] = useState(tempSelectedFilters);

  useEffect(() => {
    if (!firstRender.current) {
      FiltersQuery();
    }
    firstRender.current = false;
  }, [newMin, newMax]);

  useEffect(() => {
    return () => {};
  }, [onLoadQuery]);

  const filterProducts = (e, name, value) => {
    let flag = false;

    let tempFilters = Object.assign([], selectedFilters);

    if (e.target.checked == true) {
      if (!tempFilters.length) {
        tempFilters.push({ type: name, value: [value] });
      } else {
        for (let index = 0; index < tempFilters.length; index++) {
          if (name == tempFilters[index].type) {
            flag = true;
            tempFilters[index].value.push(value);
          }
        }
        if (flag == false) {
          tempFilters.push({
            type: name,
            value: [value],
          });
        }
      }
    } else {
      for (let index = 0; index < tempFilters.length; index++) {
        if (name == tempFilters[index].type) {
          tempFilters[index].value.splice(
            tempFilters[index].value.indexOf(value),
            1
          );
        }
      }
    }
    setSelectedFilters(Object.assign([], tempFilters));
    // console.log("Selected filters", tempFilters);
    FiltersQuery();
  };

  const FiltersQuery = () => {
    query = "";

    for (let index = 0; index < selectedFilters.length; index++) {
      if (selectedFilters[index].value.length) {
        if (index != 0) {
          query += "&";
        }
        query += selectedFilters[index].type + "=";
        query += selectedFilters[index].value.join("+");
      }
    }

    appendToUrl(query + totalPrice);
  };

  const priceFilterChange = (e) => {
    // debugger;
    let currentMin = newMin;
    let currentMax = newMax;
    if (e.target.name == "minimum") {
      setNewMin(e.target.value);
      currentMin = e.target.value;
      console.log("setNewMin", newMin);
    } else {
      setNewMax(e.target.value);
      currentMax = e.target.value;
      console.log("setNewMax", newMax);
    }

    if (currentMin < defaultMin) {
      currentMin = defaultMin;
    }

    if (currentMax > defaultMax) {
      currentMax = defaultMax;
    }

    if (!currentMin) {
      currentMin = defaultMin;
    }

    if (!currentMax) {
      currentMax = defaultMax;
    }

    setTotalPrice("&prices=" + currentMin + "-" + currentMax);
    console.log("totalPrice", totalPrice);
  };

  const clearAllFilters = () => {
    setOnLoadQuery("");
    let tempSelectedFilters = Object.assign([], selectedFilters);
    for (let i = 0; i < tempSelectedFilters.length; i++) {
      tempSelectedFilters[i].value = [];
    }
    setSelectedFilters(Object.assign([], tempSelectedFilters));
    setNewMin("");
    setNewMax("");
    setTotalPrice("");
    clearFilters();
  };

  const displayFilters = (
    <>
      {allFilters?.map((filter, i) => {
        if (filter.type !== "price" && filter.data.length) {
          return (
            <Panel header={filter.title} key={i}>
              {Array.isArray(filter.data)
                ? filter.data.map((singleFilter, j) => {
                    // debugger;
                    status = onLoadQuery.includes(singleFilter?.handle);

                    return (
                      <Row key={j}>
                        <Col span={24}>
                          <Checkbox
                            // type="checkbox"
                            className="checkboxFilters"
                            key={j}
                            onChange={(e) =>
                              filterProducts(
                                e,
                                filter.type,
                                singleFilter.handle
                              )
                            }
                            // defaultChecked={status}
                            checked={
                              selectedFilters[i].value.indexOf(
                                singleFilter.handle
                              ) > -1 || status
                            }
                            name={filter.type}
                          />

                          {singleFilter.title
                            ? singleFilter.title
                            : singleFilter}
                        </Col>
                      </Row>
                    );
                  })
                : typeof filter.data === "string"
                ? filter.data.split(",").map((singleFilter, index) => {
                    return (
                      <Row key={index}>
                        <Col span={24}>
                          <input
                            type="checkbox"
                            className="checkboxFilters"
                            key={index}
                            onChange={(e) =>
                              filterProducts(e, filter.type, singleFilter)
                            }
                            checked={
                              selectedFilters[i]?.value?.indexOf(singleFilter) >
                              -1
                            }
                            name={filter.type}
                          />
                          {singleFilter ?? null}
                        </Col>
                      </Row>
                    );
                  })
                : null}
            </Panel>
          );
        }
        if (filter.type === "price") {
          {
            defaultMin = filter.min;
            defaultMax = filter.max;
          }
          return (
            <Panel header={filter.title} key={i}>
              <Input.Group compact className="price-filters">
                <Input
                  style={{
                    width: 100,
                    textAlign: "center",
                  }}
                  type="number"
                  placeholder="Minimum"
                  name="minimum"
                  value={newMin}
                  onChange={priceFilterChange}
                />
                <Input
                  className="site-input-split"
                  style={{
                    width: 30,
                    borderLeft: 0,
                    borderRight: 0,
                    pointerEvents: "none",
                  }}
                  placeholder="~"
                  disabled
                />
                <Input
                  name="maximum"
                  className="site-input-right"
                  style={{
                    width: 100,
                    textAlign: "center",
                  }}
                  type="number"
                  placeholder="Maximum"
                  value={newMax}
                  onChange={priceFilterChange}
                />
              </Input.Group>
            </Panel>
          );
        }
      })}
    </>
  );

  return (
    <>
      <div>
        <div className="filters-head">
          <h5 className="k-sm-heading">FILTERS</h5>
          <Button
            danger
            type="text"
            // className="clear-filter-btn"
            onClick={clearAllFilters}
          >
            Clear all filters
          </Button>
        </div>
        <div className="filter-tabs">
          <Collapse accordion expandIconPosition="right">
            {displayFilters}
          </Collapse>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
