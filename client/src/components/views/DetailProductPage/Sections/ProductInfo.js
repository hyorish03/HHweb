import React from 'react'
import { Button, Descriptions } from 'antd';
import {useDispatch} from 'react-redux';
import {addToCart} from '../../../../_actions/user_actions';

function ProductInfo(props) {
    const dispatch = useDispatch();

    const clickHandler = () => {
        //필요한 정보를 mongoDB의 user의 cart필드에 넣어준다.
        //필요한 정보는 Product의 Id, 갯수, 언제 장바구니에 넣었는지 날짜 정보
        dispatch(addToCart(props.detail._id))
    }
    
  return (
    <div>
        <Descriptions title="상품 정보">
            <Descriptions.Item label="Price">{props.detail.price}</Descriptions.Item>
            <Descriptions.Item label="Sold">{props.detail.sold}</Descriptions.Item>
            <Descriptions.Item label="View">{props.detail.views}</Descriptions.Item>
            <Descriptions.Item label="상세 정보">{props.detail.description}</Descriptions.Item>
        </Descriptions>

        <br />
        <br />
        <br />
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button size='large' shape='round' type='danger' onClick={clickHandler}>
                장바구니 담기
            </Button>
            
        </div>

    </div>
  )
}

export default ProductInfo
