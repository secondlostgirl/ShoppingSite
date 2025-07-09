import React, { useEffect, useState } from "react";
import "../css/ProfileInfo.css";
import { toast } from "react-toastify";

function ProfileInfo() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const userId = JSON.parse(localStorage.getItem("user"))?.userId;

  useEffect(() => {
    // Kullanıcı verilerini al
    if (userId) {
      fetch(`http://localhost:5000/api/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUserData({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
          });
        })
        .catch(() => toast.error("Failed to fetch user info"));
    }
  }, [userId]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/update/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      const result = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(result.error || "Update failed.");
      }
    } catch (error) {
      toast.error("Update request failed.");
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast.warning("Please fill out both password fields.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/password/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(passwordData),
        }
      );

      const result = await res.json();
      if (res.ok) {
        toast.success("Password changed successfully!");
        setPasswordData({ oldPassword: "", newPassword: "" });
      } else {
        toast.error(result.error || "Password update failed.");
      }
    } catch (error) {
      toast.error("Password update request failed.");
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <div className="profile-section">
        <label>First Name</label>
        <input value={userData.firstName} disabled />

        <label>Last Name</label>
        <input value={userData.lastName} disabled />

        <label>Email</label>
        <input name="email" value={userData.email} onChange={handleChange} />

        <label>Phone</label>
        <input name="phone" value={userData.phone} onChange={handleChange} />

        <label>Address</label>
        <textarea
          name="address"
          value={userData.address}
          onChange={handleChange}
        ></textarea>

        <button onClick={handleUpdate}>Save Changes</button>
      </div>

      <div className="password-section">
        <h3>Change Password</h3>
        <input
          type="password"
          placeholder="Old Password"
          value={passwordData.oldPassword}
          onChange={(e) =>
            setPasswordData({ ...passwordData, oldPassword: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="New Password"
          value={passwordData.newPassword}
          onChange={(e) =>
            setPasswordData({ ...passwordData, newPassword: e.target.value })
          }
        />
        <button onClick={handlePasswordChange}>Update Password</button>
      </div>
    </div>
  );
}

export default ProfileInfo;
