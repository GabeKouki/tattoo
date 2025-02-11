// src/components/AddArtist.jsx
import React, { useState } from "react";
import { createAuthUser, createArtist } from "../../Utils/dashboardUtils";
import "./AddArtist.css";

const AddArtist = () => {
  // Only the following fields are set by an admin:
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    role: "artist", // default role; can also be set to "admin" if needed
    completed_setup: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Validate all required fields
  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }
    if (!formData.first_name) {
      newErrors.first_name = "First name is required.";
    }
    if (!formData.last_name) {
      newErrors.last_name = "Last name is required.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (!formData.role) {
      newErrors.role = "Role is required.";
    }
    return newErrors;
  };

  // Update formData state on input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      // Create the auth user via our utility function
      await createAuthUser(formData);
      // Insert into the public.artists table
      await createArtist(formData);
      setSuccessMsg("Artist created successfully!");
      setFormData({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        role: "artist",
      });
    } catch (error) {
      setErrors({ submit: error.message || "An error occurred. Please try again." });
      console.error("Error creating artist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-artist-container">
      <form onSubmit={handleSubmit} noValidate>
        <h2>Add Artist</h2>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            placeholder="Enter first name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          {errors.first_name && <span className="error">{errors.first_name}</span>}
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            placeholder="Enter last name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          {errors.last_name && <span className="error">{errors.last_name}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="artist">Artist</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <span className="error">{errors.role}</span>}
        </div>

        {errors.submit && <span className="error">{errors.submit}</span>}
        {successMsg && <span className="success">{successMsg}</span>}

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddArtist;
