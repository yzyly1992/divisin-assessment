import axios from 'axios';
import React, { useState } from 'react';
import ImageUploading from 'react-images-uploading';
import { api_address } from '../api';

export default function ImageUpload({userId}) {
  const [images, setImages] = useState([]);
  const maxNumber = 5;

  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };

  const handleUpload = () => {
    axios.post(api_address+'/addimages', {
        user_id: userId,
        images: images.map((image) => {
          return {
            filename: image.file.name,
            data_url: image.data_url,
          };
        })
      },{
        withCredentials: true,
        credentials: 'same-origin',
      })
      .then((response) => {
        setImages([]);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        alert('Error uploading images');
      });
  }

  return (
    <div className="uploadContainer">
      <ImageUploading
        multiple={true}
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div className="upload__image-wrapper">
            <button
              className='button largeButton'
              style={isDragging ? { color: 'red' } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            <button className='button largeButton' disabled={images.length<1} onClick={handleUpload}>Upload</button>
            <div className='imageContainer'>
            {imageList.map((image, index) => (
              <div key={index} className="image-item relative">
                <img className='stockImage' src={image['data_url']} alt="" />
                <div className="image-item__btn-wrapper topRight">
                  <button className='button smallButton' onClick={() => onImageRemove(index)}>Remove</button>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}
      </ImageUploading>
    </div>
  );
}