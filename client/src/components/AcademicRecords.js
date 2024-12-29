import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/academicrecords.css"

const AcademicRecords = () => {
  const [formData, setFormData] = useState({
    student_id: "",
    subject_id: "",
    subject_name: "",
    marks: "",
  });
  const [records, setRecords] = useState([]);
  const [showRecords, setShowRecords] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/academic-records", formData);
      alert("Academic record added successfully!");
      fetchRecords(); // Refresh records
    } catch (error) {
      console.error("There was an error adding the academic record!", error);
    }
  };

  const fetchRecords = async () => {
    try {
      const response = await axios.get("http://localhost:5000/academic-records");
      setRecords(response.data);
    } catch (error) {
      console.error("There was an error fetching the academic records!", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleShowRecords = () => {
    setShowRecords(!showRecords);
  };

  return (
    
    <div className="academic-records-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="student_id"
          value={formData.student_id}
          onChange={handleChange}
          placeholder="Student ID"
        />
        <input
          type="text"
          name="subject_id"
          value={formData.subject_id}
          onChange={handleChange}
          placeholder="Subject ID"
        />
        <input
          type="text"
          name="subject_name"
          value={formData.subject_name}
          onChange={handleChange}
          placeholder="Subject Name"
        />
        <input
          type="text"
          name="marks"
          value={formData.marks}
          onChange={handleChange}
          placeholder="Marks"
        />
        <button type="submit">Add Record</button>
      </form>
      <button onClick={handleShowRecords}>
        {showRecords ? "Hide Records" : "Show Records"}
      </button>
      {showRecords && (
        <ul>
          {records.map((record) => (
            <li key={record.id}>
              {record.student_id} - {record.subject_name} - {record.marks}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AcademicRecords;
