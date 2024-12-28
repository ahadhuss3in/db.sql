import React, { useState, useEffect } from "react";
import axios from "axios";

const LibraryRecords = () => {
  const [formData, setFormData] = useState({
    student_id: "",
    book_name: "",
    issue_date: "",
    due_date: "",
  });

  const [libraryRecords, setLibraryRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch library records when the component mounts
  useEffect(() => {
    fetchLibraryRecords();
  }, []);

  // Fetch the library records from the backend
  const fetchLibraryRecords = async () => {
    setLoading(true);
    setError(null); // Reset error message
    try {
      const response = await axios.get("http://localhost:5000/library-records/1"); // Use a specific student_id or remove :id to get all records
      setLibraryRecords(response.data); // Set the data to state
      setLoading(false); // End loading state
    } catch (err) {
      setLoading(false);
      setError("Error fetching library records.");
      console.error(err); // Log any error for debugging
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission to add a new library record
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the form data to the backend to add a new library record
      await axios.post("http://localhost:5000/library-records", formData);
      alert("Library record added successfully!");
      fetchLibraryRecords(); // Refresh the list after adding a new record
      setFormData({
        student_id: "",
        book_name: "",
        issue_date: "",
        due_date: "",
      }); // Reset the form
    } catch (error) {
      console.error("Error adding record:", error);
      alert("Error adding record");
    }
  };

  // Function to format date as YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extracts YYYY-MM-DD part
  };

  // Handle record deletion
  const handleDelete = async (student_id, book_name) => {
    try {
      await axios.delete(`http://localhost:5000/library-records/${student_id}/${book_name}`);
      alert("Library record deleted successfully!");
      fetchLibraryRecords(); // Refresh the list after deleting a record
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Error deleting record");
    }
  };

  return (
    <div className="library-records">
      <h1>Library Records</h1>

      {/* Form to add new record */}
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="student_id"
          placeholder="Student ID"
          value={formData.student_id}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="book_name"
          placeholder="Book Name"
          value={formData.book_name}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="issue_date"
          value={formData.issue_date}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Record</button>
      </form>

      {/* Displaying error or loading state */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

  
    </div>
  );
};

export default LibraryRecords;
