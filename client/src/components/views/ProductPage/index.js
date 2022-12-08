import { Button, Card } from "antd";
import Meta from "antd/lib/card/Meta";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ImageSlider from "../../utils/ImageSlider";

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const history = useHistory();

  const deleteProduct = async () => {
    await axios.delete("/api/product/" + id);
    history.push("/");
  };

  const getProduct = async () => {
    const response = (await axios.get("/api/product/" + id)).data;
    setProduct(response);
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  return (
    product && (
      <div>
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
        <Card cover={<ImageSlider images={product.images} />}>
          <Meta title={product.title} description={`${product.price}원 `} />
        </Card>
      </div>
    )
  );
};

export default ProductPage;
