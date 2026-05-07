// File Name: App.jsx

import { useState, useEffect } from "react";
import { imgurl, callApi } from "./lib.js";
import "./App.css";

const App = () => {
    const [isSignin, setIsSignIn] = useState(true);
    const [activeMenu, setActiveMenu] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem("jwt");
        if (token) {
            callApi("GET", "http://127.0.0.1:8000/authservice/uinfo", null, null, uinfoHandler, token);
        }
    }, []);

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
            "http://127.0.0.1:8000/authservice/signin",
            {
                username: email,
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
            "http://127.0.0.1:8000/authservice/signup",
            {
                fullname: fullname,
                phone: mobile,
                email: email,
                password: password
            },
            null,
            responseHandler
        );
    }

    // API Response
    function responseHandler(res) {
        if (res.jwt) {
            sessionStorage.setItem("jwt", res.jwt);
            alert("Login successful!");
            callApi("GET", "http://127.0.0.1:8000/authservice/uinfo", null, null, uinfoHandler, res.jwt);
        } else if (res.message) {
            alert(res.message);
        } else {
            alert("Success");
        }
    }

    function uinfoHandler(res) {
        if (res.code === 200) {
            setUserData(res);
            setIsLoggedIn(true);
        } else {
            alert("Failed to fetch user info: " + res.message);
            sessionStorage.removeItem("jwt");
        }
    }

    function logout() {
        sessionStorage.removeItem("jwt");
        setIsLoggedIn(false);
        setUserData(null);
    }

    // ---- Roles page state ----
    const [roleName, setRoleName] = useState("");
    const [menuName, setMenuName] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [checkedMenus, setCheckedMenus] = useState([]);

    const menuOptions = ["MyTask", "Task Manager", "User Manager", "Role Manager", "My Profile"];

    function toggleMenu(name) {
        setCheckedMenus(prev =>
            prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
        );
    }

    // Icon map: menu name -> { emoji, bg color }
    const menuIconMap = {
        "Dashboard":    { emoji: "⊞",  bg: "#4a90d9" },
        "My Task":      { emoji: "📋", bg: "#e05252" },
        "Task Manager": { emoji: "⚙️", bg: "#4a90d9" },
        "User Manager": { emoji: "👥", bg: "#4a90d9" },
        "My Profile":   { emoji: "👤", bg: "#e8a020" },
        "Roles":        { emoji: "🔑", bg: "#6c5ce7" },
    };

    // Build sidebar list: filter out 'Report', then add 'Roles'
    const sidebarItems = userData
        ? [
            ...userData.menulist.filter(item => item.menu !== "Report"),
            { menu: "Roles", icon: null, isRoles: true }
          ]
        : [];

    const rolesIndex = sidebarItems.length - 1;

    if (isLoggedIn && userData) {
        return (
            <div className="dashboard-app">

                {/* Top Header */}
                <header className="dash-header">
                    <div className="dash-logo">
                        <img src={imgurl + "logo.png"} alt="logo"
                            onError={(e) => { e.target.style.display = "none"; }} />
                        <div className="dash-logo-text">
                            <span className="logo-title">Micro-Task</span>
                            <span className="logo-sub">– Hub –</span>
                        </div>
                    </div>
                    <div className="dash-user-info">
                        <span className="dash-username">{userData.fullname}</span>
                        <button className="dash-user-btn" onClick={logout} title="Logout">⏻</button>
                    </div>
                </header>

                {/* Body: Sidebar + Content */}
                <div className="dash-body">

                    {/* Sidebar */}
                    <aside className="dash-sidebar">
                        {sidebarItems.map((item, index) => (
                            <div
                                key={index}
                                className={"dash-nav-item" + (activeMenu === index ? " active" : "")}
                                onClick={() => setActiveMenu(index)}
                            >
                                {(() => {
                                    const iconData = menuIconMap[item.menu];
                                    return (
                                        <span
                                            className="nav-icon-badge"
                                            style={{ background: iconData ? iconData.bg : "rgba(255,255,255,0.2)" }}
                                        >
                                            {iconData ? iconData.emoji : "▪"}
                                        </span>
                                    );
                                })()}
                                <span>{item.menu}</span>
                            </div>
                        ))}
                    </aside>

                    {/* Main Content */}
                    <main className="dash-main">
                        <div className="dash-content-area">
                            {activeMenu === rolesIndex ? (
                                /* ===== ROLES PAGE ===== */
                                <div className="roles-page">

                                    {/* Section 1: Add Role */}
                                    <p className="section-label">Content</p>
                                    <div className="roles-section">
                                        <div className="roles-row">
                                            <label className="roles-field-label">Roles</label>
                                            <input
                                                className="roles-input"
                                                type="text"
                                                value={roleName}
                                                onChange={e => setRoleName(e.target.value)}
                                                placeholder=""
                                            />
                                            <button className="roles-btn" onClick={() => {
                                                if (!roleName.trim()) { alert("Please enter a role name"); return; }
                                                const jwt = sessionStorage.getItem("jwt");
                                                callApi(
                                                    "POST",
                                                    "http://127.0.0.1:8000/roleservice/addrole",
                                                    { rolename: roleName },
                                                    null,
                                                    (res) => {
                                                        alert(res.message);
                                                        if (res.code === 200) setRoleName("");
                                                    },
                                                    jwt
                                                );
                                            }}>Add Role</button>
                                        </div>
                                    </div>

                                    {/* Section 2: Add Menu */}
                                    <p className="section-label">Content</p>
                                    <div className="roles-section">
                                        <div className="roles-row">
                                            <label className="roles-field-label">Menu</label>
                                            <input
                                                className="roles-input"
                                                type="text"
                                                value={menuName}
                                                onChange={e => setMenuName(e.target.value)}
                                                placeholder=""
                                            />
                                            <button className="roles-btn" onClick={() => {
                                                if (menuName.trim()) {
                                                    alert("Menu added: " + menuName);
                                                    setMenuName("");
                                                }
                                            }}>Add</button>
                                        </div>
                                    </div>

                                    {/* Section 3: Map Menu with Roles */}
                                    <p className="section-label">Content</p>
                                    <div className="roles-section map-section">
                                        <div className="map-left">
                                            <p className="map-title">Map Menu with Roles</p>
                                            <select
                                                className="roles-select"
                                                value={selectedRole}
                                                onChange={e => setSelectedRole(e.target.value)}
                                            >
                                                <option value="">Select Role</option>
                                                <option value="admin">Admin</option>
                                                <option value="user">User</option>
                                                <option value="manager">Manager</option>
                                            </select>
                                        </div>
                                        <div className="map-right">
                                            {menuOptions.map((m, i) => (
                                                <label key={i} className="map-checkbox-row">
                                                    <input
                                                        type="checkbox"
                                                        checked={checkedMenus.includes(m)}
                                                        onChange={() => toggleMenu(m)}
                                                    />
                                                    <span>{m}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <button className="roles-btn map-add-btn" onClick={() => {
                                            if (!selectedRole) { alert("Please select a role"); return; }
                                            if (checkedMenus.length === 0) { alert("Please select at least one menu"); return; }
                                            alert("Mapped " + checkedMenus.join(", ") + " to " + selectedRole);
                                        }}>Add</button>
                                    </div>

                                </div>
                            ) : (
                                <p className="dash-placeholder">Select a menu item</p>
                            )}
                        </div>
                        <footer className="dash-footer">
                            Copyright &copy; 2026. All rights reserved.
                        </footer>
                    </main>

                </div>
            </div>
        );
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
                    Copyright S9-(_2500031053_)@ 2026.
                    All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default App;