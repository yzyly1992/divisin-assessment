import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import { useState, useEffect } from 'react';
import ImageManager from './pages/ImageManager';
import axios from 'axios';
import { api_address } from './api';



export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    axios
      .get(api_address+'/usersession',{
        withCredentials: true,
        credentials: 'same-origin',
      })
      .then((response) => {
        setLoggedIn(true);
        setUserId(response.data.user_id);
      })
      .catch((error) => {
        setLoggedIn(false);
        setUserId(null);
        console.log(error);
      });
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={loggedIn?<ImageManager userId={userId} setLogin={setLoggedIn} />:<Login setLogin={setLoggedIn} setUserId={setUserId} type="login"/> } />
        </Routes>
      </Router>
    </div>
  );
};
