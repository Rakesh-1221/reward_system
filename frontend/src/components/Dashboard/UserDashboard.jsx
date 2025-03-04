import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import AuthContext from "../../context/AuthContext";

const UserDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [activeSection, setActiveSection] = useState("apps");
  const [profile, setProfile] = useState({ 
    username: "", 
    email: "", 
    points_earned: 0, 
    tasks_completed: [] 
  });

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      api.get("/apps/", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setApps(res.data))
        .catch(err => console.error("Error fetching apps:", err));

      api.get("/user/profile/", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setProfile(res.data))
        .catch(err => console.error("Error fetching profile:", err));
    } else {
      logout();
    }
  }, []);

  const handleFileChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp || !screenshot) {
      alert("Please select an app and upload a screenshot.");
      return;
    }
    
    const token = localStorage.getItem("access");
    const formData = new FormData();
    formData.append("app", selectedApp.toString());
    formData.append("screenshot", screenshot);
  
    try {
      await api.post("/task/upload/", formData, { 
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      alert("Task submitted successfully");
      setScreenshot(null);
      setSelectedApp(null);
  
      // Fetch the updated profile data immediately after completing a task
      const res = await api.get("/user/profile/", { headers: { Authorization: `Bearer ${token}` } });
      setProfile(res.data);  // Update profile state with new data
  
    } catch (error) {
      console.error("Error uploading screenshot:", error);
      alert("Failed to upload screenshot.");
    }
  };
  
  return (
    <div className="container mt-4 text-center">
      <h2>Hi {profile.username}</h2>
      <button className="btn btn-danger mb-3" onClick={logout}>Logout</button>
      <div className="btn-group d-flex">
        <button className="btn btn-primary" onClick={() => setActiveSection("apps")}>
          Available Apps
        </button>
        <button className="btn btn-success" onClick={() => setActiveSection("task")}>
          Complete a Task
        </button>
        <button className="btn btn-info" onClick={() => setActiveSection("profile")}>
          Profile
        </button>
      </div>

      {activeSection === "apps" && (
        <div className="mt-4">
          <h3>Available Apps</h3>
          {apps.length > 0 ? (
            <div className="row">
              {apps.map((app) => (
                <div key={app.id} className="col-md-4 mb-3">
                  <div className="card shadow-sm">
                    <img src={app.app_image} className="card-img-top" alt={app.name} />
                    <div className="card-body">
                      <h5 className="card-title">{app.name}</h5>
                      <p className="text-muted">Category: {app.category}</p>
                      <span className="badge bg-success">{app.points} Points</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="alert alert-warning">No apps available</p>
          )}
        </div>
      )}

      {activeSection === "task" && (
        <div className="mt-4">
          <h3>Complete a Task</h3>
          <div className="card p-4 shadow-sm">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Select App</label>
                <select className="form-control" onChange={(e) => setSelectedApp(parseInt(e.target.value))} required>
                  <option value="">Choose an app</option>
                  {apps.map((app) => (
                    <option key={app.id} value={app.id}>{app.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Upload Screenshot</label>
                <input type="file" className="form-control" onChange={handleFileChange} required />
              </div>
              <button type="submit" className="btn btn-primary">Submit Task</button>
            </form>
          </div>
        </div>
      )}

       {activeSection === "profile" && (
        <div className="mt-4">
        <h3>Profile</h3>
        <div className="card p-4 shadow-sm text-start">
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Total Rewards:</strong> {profile.points_earned} Points</p>
        <h5>Completed Tasks</h5>
        {profile.tasks_completed.length > 0 ? (
        <ul className="list-group">
          {profile.tasks_completed.map((task, index) => (
            <li key={index} className="list-group-item">
              <strong>{task.app_name || "Unknown App"}</strong>  
              <br />
              Completed on: {new Date(task.completed_at).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p className="alert alert-info">No completed tasks yet.</p>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default UserDashboard;
