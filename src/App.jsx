// File Name: App.jsx

import { useState, useEffect } from "react";
import { imgurl, callApi } from "./lib.js";
import "./App.css";

import Auth from "./pages/Auth";
import TaskManager from "./pages/TaskManager";
import UserManager from "./pages/UserManager";
import Profile from "./pages/Profile";
import RolesManager from "./pages/RolesManager";

const App = () => {
    const [activeMenu, setActiveMenu] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem("jwt");
        if (token) {
            callApi("GET", "http://127.0.0.1:8000/authservice/uinfo", null, null, uinfoHandler, token);
        }
    }, []);

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

    // Icon map: menu name -> { emoji, bg color }
    const menuIconMap = {
        "Dashboard":    { emoji: "⊞",  bg: "#4a90d9" },
        "My Task":      { emoji: "📋", bg: "#e05252" },
        "Task Manager": { emoji: "⚙️", bg: "#4a90d9" },
        "User Manager": { emoji: "👥", bg: "#4a90d9" },
        "My Profile":   { emoji: "👤", bg: "#e8a020" },
        "Roles":        { emoji: "🔑", bg: "#6c5ce7" },
    };

    // Default menus shown even if database returns empty menulist
    const DEFAULT_MENUS = [
        { menu: "Dashboard", icon: "dashboard.png" },
        { menu: "My Task",   icon: "mytask.png" },
        { menu: "Task Manager", icon: "taskmanager.png" },
        { menu: "User Manager", icon: "usermanager.png" },
        { menu: "My Profile",  icon: "myprofile.png" },
    ];

    // Build sidebar: main menus (from DB or fallback) + Report section + Roles/Class/etc from menulist
    const apiMenus = userData && Array.isArray(userData.menulist) && userData.menulist.length > 0
        ? userData.menulist
        : DEFAULT_MENUS;

    const mainMenus  = apiMenus.filter(item => !["Report","Roles","Class","Praween"].includes(item.menu));
    const reportMenus = apiMenus.filter(item => ["Roles","Class","Praween"].includes(item.menu));

    // Always include Roles in the report group
    const reportGroup = reportMenus.some(m => m.menu === "Roles")
        ? reportMenus
        : [...reportMenus, { menu: "Roles", icon: null }];

    // Flat list for index-based active tracking
    const sidebarItems = [
        ...mainMenus,
        ...reportGroup,
    ];

    const rolesIndex = sidebarItems.findIndex(i => i.menu === "Roles");

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
                        {/* Main menu items */}
                        {mainMenus.map((item, idx) => (
                            <div
                                key={item.menu}
                                className={"dash-nav-item" + (activeMenu === idx ? " active" : "")}
                                onClick={() => setActiveMenu(idx)}
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

                        {/* Report section header */}
                        <div className="sidebar-section-label">Report</div>

                        {/* Report group items (Roles, Class, Praween, etc.) */}
                        {reportGroup.map((item, idx) => {
                            const globalIdx = mainMenus.length + idx;
                            return (
                                <div
                                    key={item.menu}
                                    className={"dash-nav-item" + (activeMenu === globalIdx ? " active" : "")}
                                    onClick={() => setActiveMenu(globalIdx)}
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
                            );
                        })}
                    </aside>

                    {/* Main Content */}
                    <main className="dash-main">
                        <div className="dash-content-area">
                            {activeMenu === null ? (
                                <p className="dash-placeholder">Select a menu item</p>
                            ) : activeMenu === sidebarItems.findIndex(i => i.menu === "Dashboard") ? (
                                <p className="dash-placeholder">Dashboard Content</p>
                            ) : activeMenu === sidebarItems.findIndex(i => i.menu === "My Task") ? (
                                <p className="dash-placeholder">My Task Content</p>
                            ) : activeMenu === sidebarItems.findIndex(i => i.menu === "Task Manager") ? (
                                <TaskManager />
                            ) : activeMenu === sidebarItems.findIndex(i => i.menu === "User Manager") ? (
                                <UserManager />
                            ) : activeMenu === sidebarItems.findIndex(i => i.menu === "My Profile") ? (
                                <Profile userData={userData} />
                            ) : activeMenu === rolesIndex ? (
                                <RolesManager apiMenus={apiMenus} />
                            ) : (
                                <div className="page-welcome">
                                    <div className="welcome-icon">🔍</div>
                                    <h2>Page Not Found</h2>
                                    <p>This page is under construction.</p>
                                </div>
                            )}
                        </div>
                        <footer className="dash-footer">
                            Copyright &copy; Developed_by_Teja_2500031053. All rights reserved.
                        </footer>
                    </main>

                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <Auth setUserData={setUserData} setIsLoggedIn={setIsLoggedIn} />
        </div>
    );
};

export default App;