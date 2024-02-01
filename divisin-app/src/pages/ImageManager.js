import React from 'react';
import Gallery from '../components/Gallery';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';
import './ImageManager.css';
import { api_address } from '../api';

export default function ImageManager({userId, setLogin}) {

    const handleLogout = () => {
        axios.get(api_address+'/logout', {
                withCredentials: true,
                credentials: 'same-origin',
              })
            .then((response) => {
                setLogin(false);
            })
            .catch((error) => {
                console.log(error);
                alert("Error logging out!");
            });
    }

    return (
        <div className='managerContainer'>
            <h1>Image Library</h1>
            <Gallery userId={userId}/>
            {/* <hr className='hairline'/> */}
            <h1>Upload Images</h1>
            <p className='warnText'>*Upload a max of 5 images each time.</p>
            <ImageUpload userId={userId} />
            <p>Finished your management? <button className='button noButton' onClick={handleLogout}>Logout</button></p>
        </div>
    );
};