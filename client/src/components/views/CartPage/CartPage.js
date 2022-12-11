import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCartItems, removeCartItem } from "../../../_actions/user_actions";
import UserCardBlock from "./Sections/UserCardBlock";
import { Empty } from "antd";

function CartPage(props) {
  const dispatch = useDispatch();
  const [Total, setTotal] = useState(0);
  const [ShowTotal, setShowTotal] = useState(false);

  useEffect(() => {
    let cartItems = [];

    //redux User state안 cart 안에 상품이 들어있는지 확인
    if (props.user.userData && props.user.userData.cart) {
      //상품이 1개 이상 있는지 확인
      if (props.user.userData.cart.length > 0) {
        props.user.userData.cart.forEach((item) => {
          cartItems.push(item.id);
        });
        //여기서 user state의 cart 속 quantity를 같이 product collection에 넣어줘야한다.
        dispatch(getCartItems(cartItems, props.user.userData.cart)).then((response) => {
          calculateTotal(response.payload);
        });
      }
    }
  }, [props.user.userData]);

  let calculateTotal = (cartDetail) => {
    let total = 0;
    cartDetail.map((item) => {
      total += parseInt(item.price, 10) * item.quantity;
    });
    //위를 거치면 장바구니 속 모든 상품의 총 가격이 계산된다.
    setTotal(total);
    setShowTotal(true);
  };

  let removeFromCart = (productId) => {
    dispatch(removeCartItem(productId)).then((response) => {
      if (response.payload.productInfo.length <= 0) {
        setShowTotal(false);
      }
    });
  };

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <h1>Cart</h1>

      <div>
        <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart} />
      </div>

      {ShowTotal ? (
        <div style={{ marginTop: "3rem" }}>
          <h2>Total Price: {Total}원</h2>
        </div>
      ) : (
        <>
          <br />
          <Empty description={false} />
        </>
      )}
    </div>
  );
}

export default CartPage;
