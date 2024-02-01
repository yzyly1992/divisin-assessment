import React, { useState, useEffect } from 'react';
import StockImage from './StockImage';
import './Gallery.css';
import axios from 'axios';
import { api_address } from '../api';

export default function Gallery({userId}) {
    const [stock, setStock] = useState([]);
    const [manage, setManage] = useState(false);

    useEffect(() => {
        axios.get(api_address+`/images/${userId}`, {
                withCredentials: true,
                credentials: 'same-origin',
              })
            .then((response) => {
                setStock(response.data);
            })
            .catch((error) => {
                console.log(error);
                alert('Error requesting images');
            });
    }, [userId]);

    const handleDelete = (imageId) => {
        axios.post(api_address+'/deleteimage', {
                user_id: userId,
                image_id: imageId,
            },{
                withCredentials: true,
                credentials: 'same-origin',
              })
            .then((response) => {
                const newStock = stock.filter((image) => {
                    return image.id !== imageId;
                });
                setStock(newStock);
            })
            .catch((error) => {
                console.log(error);
                alert('Error deleting image');
            });
    }

    return (
        <div className='galleryContainer'>
            {stock.length > 0
                ? manage
                    ? <button className='button smallButton editButton' onClick={()=>setManage(false)}>Finish Edit</button>
                    : <button className='button smallButton editButton' onClick={()=>setManage(true)}>Edit</button>
                : <p className='infoText'>Your library is empty.</p>
            }
            <div className="imageContainer">
                {stock?.map((image) => {
                    return (
                        <StockImage handleDelete={handleDelete} manage={manage} userId={userId} imageId={image.id} key={image.id}/>
                    );
                })}
            </div>
        </div>
    );
};
