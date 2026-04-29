// File Name: App.jsx

import { useState } from "react";
import { imgurl, callApi } from "./lib.js";
import "./App.css";

const App = () => {
    const [isSignin, setIsSignIn] = useState(true);

    // Switch Login <-> Signup
    function switchWindow() {
        setIsSignIn((prev) => !prev);
    }

    // Handle Login
    function signin() {
        const inputs = document.querySelectorAll("input");

        const email = inputs[0].value;
        const password = inputs[1].value;

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        callApi(
            "POST",
            "http://127.0.0.1:8000/login",
            {
                email: email,
                password: password
            },
            null,
            responseHandler
        );
    }

    // Handle Signup
    function signup() {
        const inputs = document.querySelectorAll("input");

        const fullname = inputs[0].value;
        const mobile = inputs[1].value;
        const email = inputs[2].value;
        const password = inputs[3].value;
        const repassword = inputs[4].value;

        if (
            !fullname ||
            !mobile  ||
            !email ||
            !password ||
            !repassword 
        ) {
            alert("Please fill all fields");
            return;
        }

        if (password !== repassword) {
            alert("Passwords do not match");
            return;
        }

        callApi(
            "POST",
            "http://127.0.0.1:8000/signup",
            {
                fullname: fullname,
                mobile: mobile,
                email: email,
                password: password
            },
            null,
            responseHandler
        );
    }

    // API Response
    function responseHandler(res) {
        alert(res.message);
    }

    return (
        <div className="app">
            <div
                className="container"
                key={isSignin ? "signin" : "signup"}
            >
                {/* Header */}
                <div className="container-header">
                    <label>
                        {isSignin ? "Login" : "Create Account"}
                    </label>

                    <img
                        src={imgurl + "logo.png"}
                        alt="logo"
                    />
                </div>

                {/* Content */}
                <div className="container-content">

                    {isSignin ? (
                        <>
                            {/* LOGIN FORM */}

                            <label>Username*</label>
                            <div className="input-group">
                                <img
                                    src={imgurl + "user.png"}
                                    alt=""
                                />
                                <input
                                    type="text"
                                    placeholder="Enter email id"
                                    autoComplete="off"
                                />
                            </div>

                            <label>Password*</label>
                            <div className="input-group">
                                <img
                                    src={imgurl + "padlock.png"}
                                    alt=""
                                />
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                />
                            </div>

                            <p>
                                Forgot <span>Password?</span>
                            </p>

                            <button onClick={signin}>
                                Let's start
                            </button>
                            <label onClick={switchWindow}>
                                Don't have an account?
                                <span> Sign up</span>
                            </label>
                        </>
                    ) : (
                        <>
                            {/* SIGNUP FORM */}

                            <label>Full Name*</label>
                            <div className="input-group">
                                <img
                                    src={imgurl + "user.png"}
                                    alt=""
                                />
                                <input
                                    type="text"
                                    placeholder="Enter full name"
                                    autoComplete="off"
                                />
                            </div>

                            <label>Mobile Number*</label>
                            <div className="input-group">
                                <img
                                    src={imgurl + "user.png"}
                                    alt=""
                                />
                                <input
                                    type="text"
                                    placeholder="Enter mobile number"
                                    autoComplete="off"
                                />
                            </div>

                            <label>Email Address*</label>
                            <div className="input-group">
                                <img
                                    src={imgurl + "user.png"}
                                    alt=""
                                />
                                <input
                                    type="text"
                                    placeholder="Enter email id"
                                    autoComplete="off"
                                />
                            </div>

                            <label>Password*</label>
                            <div className="input-group">
                                <img
                                    src={imgurl + "user.png"}
                                    alt=""
                                />
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    autoComplete="off"
                                />
                            </div>

                            <label>Re-type Password*</label>
                            <div className="input-group">
                                <img
                                    src={imgurl + "user.png"}
                                    alt=""
                                />
                                <input
                                    type="password"
                                    placeholder="Re-type your password"
                                    autoComplete="off"
                                />
                            </div>

                            <button onClick={signup}>
                                Register
                            </button>

                            <label onClick={switchWindow}>
                                Already have an account?
                                <span> Sign in</span>
                            </label>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="container-footer">
                    Copyright S9-30138@ 2026.
                    All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default App;