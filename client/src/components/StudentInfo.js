import React, { useState } from "react";
import axios from "axios";

const StudentInfo = () => {
  const [formData, setFormData] = useState({
    student_id: "",
    admission_number: "",
    join_date: "",
    fees: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/student-info", formData);
      alert("Student info added successfully!");
    } catch (error) {
      console.error(error);
      alert("Error adding info");
    }
  };

  return (
    <div className="student-info">
      <h1>Student Information</h1>
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
          name="admission_number"
          placeholder="Admission Number"
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="join_date"
          placeholder="Join Date"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="fees"
          placeholder="Fees"
          onChange={handleChange}
          required
        />
        <button type="submit">Add Info</button>
      </form>
    </div>
  );
};

export default StudentInfo;
