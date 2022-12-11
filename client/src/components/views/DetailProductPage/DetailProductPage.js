import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductInfo from "./Sections/ProductInfo";
import { Row, Col, Button } from "antd";
import styled from "styled-components";
import ImageGallery from "react-image-gallery";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import "react-image-gallery/styles/css/image-gallery.css";

function DetailProductPage(props) {
  const productId = props.match.params.productId;
  const [product, setProduct] = useState();
  const history = useHistory();

  const deleteProduct = async () => {
    await axios.delete("/api/product/" + productId);
    history.push("/");
  };

  const getProduct = async () => {
    const response = (await axios.get(`/api/product/products_by_id?id=${productId}&type=single`))
      .data[0];
    setProduct(response);
  };

  useEffect(() => {
    getProduct();
  }, [productId]);

  return (
    <Wrapper style={{ width: "100%", padding: "3rem 4rem" }}>
      <div style={{ margin: "1rem 0", display: "flex", justifyContent: "space-between" }}>
        <Button onClick={() => history.goBack()}>뒤로가기</Button>
        <Button
          onClick={async () => {
            if (window.confirm("정말 삭제하시겠습니까?")) {
              await deleteProduct();
              alert("삭제되었습니다!");
            }
          }}
        >
          삭제
        </Button>
      </div>
      {product ? (
        <>
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <h1>{product.title}</h1>
          </div>
          <br />
          <Row gutter={[16, 16]}>
            <Col lg={12} sm={24}>
              <ImageGallery
                items={product.images.map((image) => ({
                  original: `${Axios.defaults.baseURL}/${image}`,
                  thumbnail: `${Axios.defaults.baseURL}/${image}`,
                }))}
              />
            </Col>

            <Col lg={12} sm={24}>
              <div>
                <ProductInfo detail={product} />
              </div>
            </Col>
          </Row>
        </>
      ) : null}
    </Wrapper>
  );
}

export default DetailProductPage;

const Wrapper = styled.div``;
