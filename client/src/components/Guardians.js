import React, { useState } from "react";
import axios from "axios";
import "./styles/guardians.css"

const Guardians = () => {
  const [formData, setFormData] = useState({
    student_id: "",
    name: "",
    relationship: "",
    contact_number: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/guardians", formData);
      alert("Guardian info added successfully!");
    } catch (error) {
      console.error(error);
      alert("Error adding info");
    }
  };

  return (
    <div className="guardians-container">
      <h1>Guardians</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="student_id"
          placeholder="Student ID"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Guardian Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="relationship"
          placeholder="Relationship"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact_number"
          placeholder="Contact Number"
          onChange={handleChange}
          required
        />
        <button type="submit">Add Guardian</button>
      </form>
    </div>
  );
};

export default Guardians;
