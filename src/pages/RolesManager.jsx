import { useState, useEffect } from "react";
import { callApi } from "../lib.js";

export default function RolesManager({ apiMenus }) {
    const [roleName, setRoleName] = useState("");
    const [menuName, setMenuName] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [checkedMenus, setCheckedMenus] = useState([]);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        fetchRoles();
    }, []);

    function fetchRoles() {
        const jwt = sessionStorage.getItem("jwt");
        callApi(
            "GET",
            "http://127.0.0.1:8000/roleservice/getallroles",
            null,
            null,
            (res) => {
                if (res.code === 200 && Array.isArray(res.roles)) {
                    setRoles(res.roles);
                }
            },
            jwt
        );
    }

    function toggleMenu(mid) {
        setCheckedMenus(prev =>
            prev.includes(mid) ? prev.filter(m => m !== mid) : [...prev, mid]
        );
    }

    return (
        <div className="roles-page">
            {/* Section 1: Add Role */}
            <div className="rm-section-header">Role Management</div>
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
                                if (res.code === 200) {
                                    setRoleName("");
                                    fetchRoles();
                                }
                            },
                            jwt
                        );
                    }}>Add Role</button>
                </div>
            </div>

            {/* Roles Table */}
            <div className="roles-table-wrapper">
                <table className="roles-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Role ID</th>
                            <th>Role Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.length === 0 ? (
                            <tr><td colSpan="3" style={{textAlign:"center",opacity:0.5}}>No roles found</td></tr>
                        ) : (
                            roles.map((r, i) => (
                                <tr key={r.role ?? i}>
                                    <td>{i + 1}</td>
                                    <td>{r.role}</td>
                                    <td>{r.rolename}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Section 2: Add Menu */}
            <div className="rm-section-header">Menu Management</div>
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
                        if (!menuName.trim()) { alert("Please enter a menu name"); return; }
                        const jwt = sessionStorage.getItem("jwt");
                        callApi(
                            "POST",
                            "http://127.0.0.1:8000/roleservice/addmenu",
                            { menuname: menuName },
                            null,
                            (res) => {
                                alert(res.message);
                                if (res.code === 200) setMenuName("");
                            },
                            jwt
                        );
                    }}>Add</button>
                </div>
            </div>

            {/* Section 3: Map Menu with Roles */}
            <div className="rm-section-header">Role-Menu Mapping</div>
            <div className="roles-section map-section">
                <div className="map-left">
                    <p className="map-title">Map Menu with Roles</p>
                    <select
                        className="roles-select"
                        value={selectedRole}
                        onChange={e => setSelectedRole(e.target.value)}
                    >
                        <option value="">Select Role</option>
                        {roles.map((r) => (
                            <option key={r.role} value={r.role}>
                                {r.rolename}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="map-right">
                    {apiMenus.map((m) => (
                        <label key={m.mid ?? m.menu} className="map-checkbox-row">
                            <input
                                type="checkbox"
                                checked={checkedMenus.includes(m.mid)}
                                onChange={() => toggleMenu(m.mid)}
                            />
                            <span>{m.menu}</span>
                        </label>
                    ))}
                </div>
                <button className="roles-btn map-add-btn" onClick={() => {
                    if (!selectedRole) { alert("Please select a role"); return; }
                    if (checkedMenus.length === 0) { alert("Please select at least one menu"); return; }
                    const jwt = sessionStorage.getItem("jwt");
                    callApi(
                        "POST",
                        "http://127.0.0.1:8000/roleservice/addmapping",
                        { role: Number(selectedRole), mids: checkedMenus },
                        null,
                        (res) => {
                            alert(res.message);
                            if (res.code === 200) setCheckedMenus([]);
                        },
                        jwt
                    );
                }}>Add</button>
            </div>
        </div>
    );
}
