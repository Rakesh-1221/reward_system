import React, { useEffect, useState } from "react";
import api from "../../services/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api
      .get("/user/profile/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2>{profile.username}'s Profile</h2>
      <p>Email: {profile.email}</p>
      <p>Role: {profile.role}</p>
      <p>Points Earned: {profile.points_earned}</p>
      <p>Tasks Completed: {profile.tasks_completed.length}</p>
    </div>
  );
};

export default Profile;
