import React from "react";
import { Carousel } from "antd";
import Axios from "axios";

function ImageSlider(props) {
  return (
    <div>
      <Carousel autoplay>
        {props.images.map((image, index) => (
          <div key={index}>
            <img
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                objectPosition: "center",
              }}
              src={`${Axios.defaults.baseURL}/${image}`}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default ImageSlider;
