import React, { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import axios from "axios";
import { Icon, Col, Card, Row, Carousel, Checkbox } from "antd";
import Meta from "antd/lib/card/Meta";
import Column from "antd/lib/table/Column";
import ImageSlider from "../../utils/ImageSlider";
import CheckBox from "./Sections/CheckBox";
import { Clothes } from "./Sections/Datas";
import { useHistory } from "react-router-dom";

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);
  const [PostSize, setPostSize] = useState(0);
  const [Filters, setFilters] = useState({
    clothes: [],
    price: [],
  });
  let history = useHistory();

  useEffect(() => {
    let body = {
      skip: Skip,
      limit: Limit,
    };

    getProducts(body);
  }, []);

  const renderCards = products.map((product, index) => {
    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <Card
          cover={<ImageSlider images={product.images} />}
          onClick={() => history.push(`/Product/${product._id}`)}
        >
          <Meta title={product.title} description={`${product.price}원 `} />
        </Card>
      </Col>
    );
  });

  const getProducts = (body) => {
    axios.post("/api/product/products", body).then((response) => {
      if (response.data.success) {
        if (body.loadMore) {
          setProducts([...products, ...response.data.productInfo]);
        } else {
          setProducts(response.data.productInfo);
        }
        setPostSize(response.data.postSize);
      } else {
        alert("상품들을 가져오는데 실패 했습니다.");
      }
    });
  };

  const loadMoreHandler = () => {
    let skip = Skip + Limit;
    let body = {
      skip: skip,
      limit: Limit,
      loadMore: true,
    };
    getProducts(body);
    setSkip(skip);
  };

  const showFilteredResults = (filters) => {
    let body = {
      skip: 0,
      limit: Limit,
      filters: filters,
    };
    getProducts(body);
    setSkip(0);
  };

  const handleFilters = (filters, category) => {
    const newFilters = { ...Filters };
    newFilters[category] = filters;
    showFilteredResults(newFilters);
  };

  return (
    <div style={{ width: "75%", margin: "3rem auto", display: "flex", flexDirection: "column" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          Let's Select Your Clothes <Icon type="rocket" />
        </h2>
      </div>
      {/*Filter*/}

      {/*Checkbox*/}
      <CheckBox list={Clothes} handleFilters={(filters) => handleFilters(filters, "Clothes")} />

      {/*Search*/}

      {/*Cards*/}

      {<Row gutter={[16, 16]}>{renderCards}</Row>}

      {PostSize >= Limit && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
          <button
            onClick={loadMoreHandler}
            style={{ borderColor: "white", backgroundColor: "#ECE6CC" }}
          >
            더보기
          </button>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
