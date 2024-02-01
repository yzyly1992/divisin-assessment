import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { api_address } from '../api';

export default function Login({setLogin, type, setUserId}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loginType, setLoginType] = useState(type);
    const [error, setError] = useState(null);

    const handleLogin = () => {
        // check if email is valid
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            setError("Invalid email address");
            return;
        }
        // check if password is valid
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError("Password must be at least 8 characters and contain at least one letter and one number");
            return;
        }
        // post /login request
        axios.post(api_address+'/login', {
                email: email,
                password: password,
            },{
                withCredentials: true,
                credentials: 'same-origin',
              })
            .then((response) => {
                setError(null);
                setUserId(response.data.user_id);
                setLogin(true);
            })
            .catch((error) => {
                console.log(error);
                setError("Invalid email or password");
            });
    };

    const handleRegister = () => {
        // check if email is valid
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            setError("Invalid email address");
            return;
        }
        // check if password is valid
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError("Password must be at least 8 characters and contain at least one letter and one number");
            return;
        }
        // check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        // post /register to sign up new user
        axios.post(api_address+'/register', {
                email: email,
                password: password,
            },{
                withCredentials: true,
                credentials: 'same-origin',
              })
            .then((response) => {
                setError(null);
                setUserId(response.data.user_id);
                setLogin(true);
            })
            .catch((error) => {
                console.log(error);
                setError("Email already exists");
            });
    };

    return (
        <div className='loginContainer'>
            {loginType==="login" ? <h1>Sign In</h1> : <h1>Register</h1>}
            <div className='inputContainer'>
                {error && <p className='errorMessage'>{error}</p>}
                <input
                    className='input'
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className='input'
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {loginType!=="login"&&<input
                    className='input'
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />}
            </div>

            {loginType==="login" ? <button className='button largeButton' onClick={handleLogin}>Sign In</button> : <button className='button largeButton' onClick={handleRegister}>Register</button>}
            {loginType==="login" ? <p>Don't have an account? <button className='button noButton' onClick={()=>setLoginType("register")}>Register</button></p> : <p>Already have an account? <button className='button noButton' onClick={()=>setLoginType("login")}>Login</button></p>
            }

        </div>
    );
};
