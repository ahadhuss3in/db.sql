import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/view.css";

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState(null);
  const [showAcademic, setShowAcademic] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch students from the API
  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/students");
      setStudents(response.data);
    } catch (err) {
      setError("Failed to fetch students");
    }
  };

  // View student details
  const viewDetails = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:5000/student-details/${studentId}`);
      setSelectedStudent(response.data); // Expecting full student details in response
    } catch (err) {
      setError("Failed to fetch student details");
    }
  };

  // Handle showing/hiding academic records, attendance, and library records
  const toggleAcademic = () => setShowAcademic(!showAcademic);
  const toggleAttendance = () => setShowAttendance(!showAttendance);
  const toggleLibrary = () => setShowLibrary(!showLibrary);

  // Handle student deletion
  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.delete(`http://localhost:5000/students/${studentId}`);
      alert("Student deleted successfully!");
      setSelectedStudent(null); // Close the modal
      fetchStudents(); // Refresh the list of students
    } catch (error) {
      console.error("There was an error deleting the student!", error);
      alert("Error deleting student");
    }
  };

  // Handle library record deletion
  const handleDeleteLibraryRecord = async (studentId, bookName) => {
    try {
      await axios.delete(`http://localhost:5000/library-records/${studentId}/${bookName}`);
      alert("Library record deleted successfully!");
      viewDetails(studentId); // Refresh the student details
    } catch (error) {
      console.error("There was an error deleting the library record!", error);
      alert("Error deleting library record");
    }
  };

  // Handle search
  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/students?search=${searchQuery}`);
      setStudents(response.data);
    } catch (err) {
      setError("Failed to search students");
    }
  };

  return (
    <div className="view-students">
      <h2>Student List</h2>
      {error && <div className="error">{error}</div>}

      {/* Search input and button */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name or ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <table className="student-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Section</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>{student.section}</td>
              <td>{student.grade}</td>
              <td>
                <button className="view-btn" onClick={() => viewDetails(student.id)}>
                  View Details
                </button>
                <button className="delete-btn" onClick={() => handleDeleteStudent(student.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedStudent && (
        <div className="modal">
          <div className="modal-content">
            <h3>Student Details</h3>
            <table>
              <tbody>
                <tr>
                  <th>ID</th>
                  <td>{selectedStudent.student.id}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{selectedStudent.student.name}</td>
                </tr>
                <tr>
                  <th>Age</th>
                  <td>{selectedStudent.student.age}</td>
                </tr>
                <tr>
                  <th>Section</th>
                  <td>{selectedStudent.student.section}</td>
                </tr>
                <tr>
                  <th>Grade</th>
                  <td>{selectedStudent.student.grade}</td>
                </tr>
                <tr>
                  <th>Admission Number</th>
                  <td>{selectedStudent.studentInfo?.admission_number}</td>
                </tr>
                <tr>
                  <th>Join Date</th>
                  <td>{selectedStudent.studentInfo?.join_date}</td>
                </tr>
                <tr>
                  <th>Fees</th>
                  <td>{selectedStudent.studentInfo?.fees}</td>
                </tr>
                <tr>
                  <th>Guardian Name</th>
                  <td>{selectedStudent.guardians[0]?.name}</td>
                </tr>
                <tr>
                  <th>Guardian Relationship</th>
                  <td>{selectedStudent.guardians[0]?.relationship}</td>
                </tr>
                <tr>
                  <th>Guardian Contact</th>
                  <td>{selectedStudent.guardians[0]?.contact_number}</td>
                </tr>
              </tbody>
            </table>

            {/* Buttons for different sections */}
            <button onClick={toggleLibrary}>Library Details</button>
            <button onClick={toggleAttendance}>Attendance</button>
            <button onClick={toggleAcademic}>Academic Records</button>
            <button onClick={() => setSelectedStudent(null)}>Close</button>

            {/* Display Library Records */}
            {showLibrary && selectedStudent.libraryRecords && (
              <div>
                <h4>Library Records</h4>
                <table>
                  <tbody>
                    {selectedStudent.libraryRecords.map((record, index) => (
                      <tr key={index}>
                        <th>Book Name</th>
                        <td>{record.book_name}</td>
                        <th>Issue Date</th>
                        <td>{record.issue_date}</td>
                        <th>Due Date</th>
                        <td>{record.due_date}</td>
                        <td>
                          <button onClick={() => handleDeleteLibraryRecord(selectedStudent.student.id, record.book_name)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Display Attendance */}
            {showAttendance && selectedStudent.attendanceRecords && (
              <div>
                <h4>Attendance Records</h4>
                <table>
                  <tbody>
                    {selectedStudent.attendanceRecords.map((attendance, index) => (
                      <tr key={index}>
                        <th>Date</th>
                        <td>{attendance.date}</td>
                        <th>Status</th>
                        <td>{attendance.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Display Academic Records */}
            {showAcademic && selectedStudent.academicRecords && (
              <div>
                <h4>Academic Records</h4>
                <table>
                  <tbody>
                    {selectedStudent.academicRecords.map((record, index) => (
                      <tr key={index}>
                        <th>Subject Name</th>
                        <td>{record.subject_name}</td>
                        <th>Marks</th>
                        <td>{record.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStudents;
