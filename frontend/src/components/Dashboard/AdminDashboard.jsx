// import React, { useState, useEffect, useContext } from "react";
// import api from "../../services/api";
// import AuthContext from "../../context/AuthContext";  // Import AuthContext

// const AdminDashboard = () => {
//   const { logout } = useContext(AuthContext); // Get logout function

//   const [apps, setApps] = useState([]);
//   const [form, setForm] = useState({ 
//     name: "", 
//     app_link: "", 
//     category: "", 
//     sub_category: "", 
//     points: 0, 
//     app_image: null 
//   });

//   useEffect(() => {
//     const token = localStorage.getItem("access"); // Get token from localStorage
//     if (token) {
//       api.get("/apps/", {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       .then((res) => setApps(res.data))
//       .catch((err) => {
//         console.error("Error fetching apps:", err);
//         if (err.response && err.response.status === 401) {
//           logout(); // Logout if unauthorized
//         }
//       });
//     } else {
//       logout(); // Redirect to login if token is missing
//     }
//   }, []);
  

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setForm({ ...form, app_image: e.target.files[0] });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("access"); // Get token
  
//     const formData = new FormData();
//     Object.keys(form).forEach((key) => formData.append(key, form[key]));
  
//     try {
//       await api.post("/apps/add/", formData, { 
//         headers: { 
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}` // Add token here
//         }
//       });
  
//       //  Fetch updated list after adding an app
//       const res = await api.get("/apps/", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setApps(res.data); // Update state with new apps
  
//       // Clear the form
//       setForm({ 
//         name: "", 
//         app_link: "", 
//         category: "", 
//         sub_category: "", 
//         points: 0, 
//         app_image: null 
//       });
  
//       //  Reset file input field
//       document.getElementById("appImageInput").value = "";
  
//     } catch (error) {
//       console.error("Error adding app:", error);
//     }
//   };
  

//   return (
//     <div className="container mt-4">
//       {/* Header Section */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2>Admin Dashboard</h2>
//         <button className="btn btn-danger" onClick={logout}>Logout</button>
//       </div>
      
//       {/* Add App Form */}
//       <div className="card p-4 shadow-sm border-0 mb-4">
//         <h4 className="mb-3">Add App</h4>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <input type="text" className="form-control" name="name" placeholder="App Name" onChange={handleChange} required />
//           </div>
//           <div className="mb-3">
//             <input type="url" className="form-control" name="app_link" placeholder="App Link" onChange={handleChange} required />
//           </div>
//           <div className="mb-3">
//             <select className="form-control" name="category" onChange={handleChange} required>
//               <option value="">Select Category</option>
//               <option value="Entertainment">Entertainment</option>
//               <option value="Gaming">Gaming</option>
//               <option value="Education">Education</option>
//               <option value="Social">Social</option>
//               <option value="Shopping">Shopping</option>
//             </select>
//           </div>

//           <div className="mb-3">
//             <input type="text" className="form-control" name="sub_category" placeholder="Sub-category" onChange={handleChange} required />
//           </div>
//           <div className="mb-3">
//             <input type="number" className="form-control" name="points" placeholder="Points" onChange={handleChange} required />
//           </div>
//           <div className="mb-3">
//           <input 
//             type="file" 
//             className="form-control" 
//             name="app_image" 
//             id="appImageInput" //  Add this ID
//             onChange={handleFileChange} 
//             required 
//           />

//           </div>
//           <button type="submit" className="btn btn-primary">Add App</button>
//         </form>
//       </div>
      
//       {/* Existing Apps Section */}
//       <h3 className="mt-4">Existing Apps</h3>
//       {apps.length > 0 ? (
//         <div className="card p-3 shadow-sm border-0">
//           <ul className="list-group">
//             {apps.map((app) => (
//               <li 
//                 key={app.id} 
//                 className="list-group-item d-flex justify-content-between align-items-center shadow-sm rounded border-0"
//                 style={{ backgroundColor: "#f8f9fa", padding: "12px", marginBottom: "8px" }}
//               >
//                 <div>
//                   <h5 className="mb-1 text-primary">{app.name}</h5>
//                   <p className="mb-0 text-muted"><strong>Category:</strong> {app.category}</p>
//                 </div>
//                 <span 
//                   className="badge bg-success rounded-pill" 
//                   style={{ fontSize: "14px", padding: "8px 12px" }}
//                 >
//                   {app.points} Points
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <div className="alert alert-warning mt-3">No apps available</div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import AuthContext from "../../context/AuthContext";

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState({ name: "", app_link: "", category: "", sub_category: "", points: 0, app_image: null });
  const [activeSection, setActiveSection] = useState("add"); // Toggle state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for popup

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      api.get("/apps/", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setApps(res.data))
        .catch((err) => {
          console.error("Error fetching apps:", err);
          if (err.response && err.response.status === 401) logout();
        });
    } else logout();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setForm({ ...form, app_image: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    try {
      await api.post("/apps/add/", formData, { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } });
      
      // Fetch updated app list
      const res = await api.get("/apps/", { headers: { Authorization: `Bearer ${token}` } });
      setApps(res.data);

      // Show success popup
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2000); // Hide popup after 2 seconds

      // Clear form data
      setForm({ name: "", app_link: "", category: "", sub_category: "", points: 0, app_image: null });
      document.getElementById("appImageInput").value = ""; // Clear file input manually
    } catch (error) {
      console.error("Error adding app:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-danger" onClick={logout}>Logout</button>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="alert alert-success position-fixed top-0 start-50 translate-middle-x" style={{ zIndex: 1050 }}>
          Application added successfully!
        </div>
      )}

      {/* Toggle Buttons */}
      <div className="mb-3">
        <button className={`btn ${activeSection === "add" ? "btn-primary" : "btn-outline-primary"} me-2`} onClick={() => setActiveSection("add")}>
          Add App
        </button>
        <button className={`btn ${activeSection === "view" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setActiveSection("view")}>
          View Apps
        </button>
      </div>

      {/* Add App Form */}
      {activeSection === "add" && (
        <div className="card p-4 shadow-sm border-0 mb-4">
          <h4 className="mb-3">Add App</h4>
          <form onSubmit={handleSubmit}>
            <input type="text" className="form-control mb-3" name="name" placeholder="App Name" value={form.name} onChange={handleChange} required />
            <input type="url" className="form-control mb-3" name="app_link" placeholder="App Link" value={form.app_link} onChange={handleChange} required />
            <select className="form-control mb-3" name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Gaming">Gaming</option>
              <option value="Education">Education</option>
              <option value="Social">Social</option>
              <option value="Shopping">Shopping</option>
            </select>
            <input type="text" className="form-control mb-3" name="sub_category" placeholder="Sub-category" value={form.sub_category} onChange={handleChange} required />
            <input type="number" className="form-control mb-3" name="points" placeholder="Points" value={form.points} onChange={handleChange} required />
            <input type="file" className="form-control mb-3" name="app_image" id="appImageInput" onChange={handleFileChange} required />
            <button type="submit" className="btn btn-primary">Add App</button>
          </form>
        </div>
      )}

      {/* Existing Apps Section */}
      {activeSection === "view" && (
        <div>
          <h3 className="mt-4">Existing Apps</h3>
          {apps.length > 0 ? (
            <div className="card p-3 shadow-sm border-0">
              <ul className="list-group">
                {apps.map((app) => (
                  <li key={app.id} className="list-group-item d-flex justify-content-between align-items-center shadow-sm rounded border-0" style={{ backgroundColor: "#f8f9fa", padding: "12px", marginBottom: "8px" }}>
                    <div>
                      <h5 className="mb-1 text-primary">{app.name}</h5>
                      <p className="mb-0 text-muted"><strong>Category:</strong> {app.category}</p>
                    </div>
                    <span className="badge bg-success rounded-pill" style={{ fontSize: "14px", padding: "8px 12px" }}>{app.points} Points</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="alert alert-warning mt-3">No apps available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
