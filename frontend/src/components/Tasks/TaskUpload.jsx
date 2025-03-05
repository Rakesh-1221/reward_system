import React, { useState, useEffect } from "react";
import api from "../../services/api";

const TaskUpload = () => {
  const [apps, setApps] = useState([]); // Fetch available apps
  const [appId, setAppId] = useState("");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    //  Fetch apps for dropdown
    const fetchApps = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await api.get("/apps/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApps(response.data);
      } catch (error) {
        console.error("Error fetching apps:", error);
      }
    };
    fetchApps();
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appId || !file) {
      alert("Please select an app and upload a screenshot.");
      return;
    }

    const formData = new FormData();
    formData.append("app", appId);
    formData.append("screenshot", file);

    try {
      const token = localStorage.getItem("access");
      const response = await api.post("/task/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message || "Task uploaded successfully!");
      setFile(null);
      setAppId("");
    } catch (error) {
      console.error("Error uploading task:", error);
      alert(
        error.response?.data?.error || "Failed to upload task. Please try again."
      );
    }
  };

  return (
    <div className="container mt-3">
      <form onSubmit={handleSubmit} className="p-3">
        <div className="mb-3">
          <label className="form-label">Select App</label>
          <select
            className="form-control"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            required
          >
            <option value="">Choose an app</option>
            {apps.map((app) => (
              <option key={app.id} value={app.id}>
                {app.name}
              </option>
            ))}
          </select>
        </div>

        <div
          className={`border p-4 text-center ${dragging ? "bg-light" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p>Drag & Drop your screenshot here</p>
          <input type="file" className="form-control" onChange={handleFileChange} required />
        </div>

        {file && <p className="text-success mt-2">Selected file: {file.name}</p>}

        <button type="submit" className="btn btn-primary w-100 mt-3">
          Upload Task
        </button>
      </form>
    </div>
  );
};

export default TaskUpload;
