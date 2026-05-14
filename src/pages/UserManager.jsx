import { useState, useEffect } from "react";
import { callApi } from "../lib.js";

export default function UserManager() {
    const [allUsers, setAllUsers] = useState([]);

    function fetchAllUsers() {
        const jwt = sessionStorage.getItem("jwt");
        callApi(
            "GET",
            "http://127.0.0.1:8000/authservice/listusers",
            null,
            null,
            (res) => {
                if (Array.isArray(res)) {
                    setAllUsers(res);
                } else if (res && Array.isArray(res.users)) {
                    setAllUsers(res.users);
                }
            },
            jwt
        );
    }

    return (
        <div className="roles-page">
            <div className="rm-section-header">User Manager</div>
            <div className="roles-section">
                <button className="roles-btn" onClick={fetchAllUsers} style={{marginBottom: "1rem"}}>Refresh Users</button>
                <div className="roles-table-wrapper">
                    <table className="roles-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUsers.length === 0 ? (
                                <tr><td colSpan="5" style={{textAlign:"center",opacity:0.5}}>No users found or click Refresh</td></tr>
                            ) : (
                                allUsers.map((u, i) => (
                                    <tr key={u.id ?? i}>
                                        <td>{u.id}</td>
                                        <td>{u.fullname}</td>
                                        <td>{u.email}</td>
                                        <td>{u.phone}</td>
                                        <td>{u.role}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
