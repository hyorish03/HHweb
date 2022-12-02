import React, { useState } from "react";
import {Typography, Button, Form, Input} from 'antd';
import FileUpload from "../../utils/FileUpload";

const {TextArea} = Input;
const Continents = [
  {key : 1, value : "Africa"},
  {key : 2, value : "North America"},
  {key : 3, value : "Aisa"},
  {key : 4, value : "Europe"},
  {key : 5, value : "Austria"},
  {key : 6, value : "Antarctica"},
  {key : 7, value : "South America"}
 ];

function UploadProductPage() {

  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Price, setPrice] = useState(0);
  const [Continent, setContinent] = useState(1);
  const [Images, setImagpes] = useState("");


  const titleChangeHandler = (event) => {
    setTitle(event.target.value)
  } 

  const descriptionChangeHandler = (event) => {
    setDescription(event.target.value)
  } 

  const priceChangeHandler = (event) => {
    setPrice(event.target.value)
  } 

  const continentChangeHandler = (event) => {
    setContinent(event.target.value)
  } 


  return ( 
    <div style={{maxwidth: '700px', margin: '2rem auto'}}>
      <div style={{textAlign: 'center', marginBotton: '2rem'}}>
        <h2 level={2}>여행상품 업로드</h2>
      </div>

      <Form>
        <FileUpload/>
        <br  />
        <br/>
        <label>이름</label>
        <Input onChange={titleChangeHandler} value ={Title}/>

        <br/>
        <br/>
        <label>설명</label>
        <TextArea onChange={descriptionChangeHandler} value ={Description} />

        <br/>
        <br/>
        <label>가격($)</label>
        <Input type = "number" onChange={priceChangeHandler} value ={Price}/>
        <br/>
        <br/>
        <select onChange={continentChangeHandler} value={Continent}>
          {Continents.map(item=> (
            <option key = {item.key} value = {item.key}> {item.value} </option>
          ))}
          
          

        </select>
        <br/>
        <br/>
        <Button>
          확인
        </Button>
      </Form>
    </div>
 )
}

export default UploadProductPage;
