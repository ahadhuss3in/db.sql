import React, { useState } from "react";
import axios from "axios";
import "./styles/home.css"

const Home = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    section: "",
    grade: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/students", formData);
      alert("Student added successfully!");
      setFormData({ name: "", age: "", section: "", grade: "" });
    } catch (error) {
      console.error("There was an error adding the student!", error);
      alert("Error adding student");
    }
  };

  return (
    <div className="home">
      <h1>Teacher Portal</h1>
      <h3>Add student</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="section"
          placeholder="Section"
          value={formData.section}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="grade"
          placeholder="Grade"
          value={formData.grade}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};

export default Home;
