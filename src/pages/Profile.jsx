export default function Profile({ userData }) {
    if (!userData) return null;

    return (
        <div className="page-profile">
            <h2 className="page-title">My Profile</h2>
            <div className="profile-card">
                <div className="profile-avatar">
                    {userData.fullname ? userData.fullname.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="profile-details">
                    <div className="profile-row">
                        <span className="profile-label">Full Name</span>
                        <span className="profile-value">{userData.fullname}</span>
                    </div>
                    <div className="profile-row">
                        <span className="profile-label">Email</span>
                        <span className="profile-value">{userData.email || "—"}</span>
                    </div>
                    <div className="profile-row">
                        <span className="profile-label">Phone</span>
                        <span className="profile-value">{userData.phone || "—"}</span>
                    </div>
                    <div className="profile-row">
                        <span className="profile-label">Role</span>
                        <span className="profile-value">
                            <span className="task-badge" style={{background:"#eff6ff",color:"#2563eb"}}>
                                {userData.role || "—"}
                            </span>
                        </span>
                    </div>
                    <div className="profile-row">
                        <span className="profile-label">Status</span>
                        <span className="profile-value">
                            <span className="task-badge" style={{background:"#f0fdf4",color:"#16a34a"}}>Active</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
