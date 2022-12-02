import React from 'react'
import DropZone from 'react-dropzone'
import {Icon} from 'antd'
import Axios from 'axios'

function FileUpload() {
    const dropHandler = (files) => {
      let formData = new FormData();
      const config ={
        header: {'content-type': 'multipart/form-data'}
      }
      formData.append("files", files[0])
      Axios.post('/api/product/image', formData, config)
      .then(response => {
        if(response.data.success) {
          console.log(response.data);
        } else {
          alert("파일을 저장하는데에 실패했습니다. ")
        }
      })

    }
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between'}}>
        <DropZone onDrop={dropHandler}>
          {({getRootProps, getInputProps}) => (
              <div 
                style={{width:300, height: 240, border: '1px solid lightgray',
                        display:'flex', alignItems:'center', justifyContent:'center'}} 
                {...getRootProps()}>
                <input {...getInputProps()} />
                <Icon type = "plus" style = {{fontSize:'3rem'}}/>
              </div>
          )}
      </DropZone>
    </div>
  )
}

export default FileUpload
