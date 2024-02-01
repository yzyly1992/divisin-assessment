import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StockImage.css';
import { api_address } from '../api';

export default function StockImage({handleDelete, manage, userId, imageId}) {
    const [image, setImage] = useState(null);
    useEffect(() => {
        axios.post(api_address+'/getimage', {
                user_id: userId,
                image_id: imageId,
            },{
                withCredentials: true,
                credentials: 'same-origin',
                responseType: 'blob',
              })
            .then((response) => {
                const url = URL.createObjectURL(response.data);
                setImage(url);
            })
            .catch((error) => {
                console.log(error);
            });
    },[imageId, userId])

  return (
    <div className='relative'>
        <img className='stockImage' src={image&&image} alt={imageId} key={imageId}/>
        {manage&&<button className='button smallButton topRight' onClick={()=>handleDelete(imageId)}>Delete</button>}
    </div>
  )
}
