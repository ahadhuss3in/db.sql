import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/attendance.css";

const Attendance = () => {
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [students, setStudents] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (grade && section) {
      fetchStudents();
    } else {
      setStudents([]); // Clear students if grade or section is not selected
    }
  }, [grade, section]);

  // Fetch students based on grade and section
  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/studentss`, {
        params: { grade, section },
      });
      setStudents(response.data);
    } catch (err) {
      setErrorMessage("Failed to fetch students");
    }
  };

  // Handle individual attendance marking
  const handleIndividualAttendance = async (studentId, status) => {
    try {
      const response = await axios.post("http://localhost:5000/attendance", {
        student_id: studentId,
        status,
      });
      setAttendanceStatus((prevStatus) => ({
        ...prevStatus,
        [studentId]: status,
      }));
      alert(`Attendance marked as ${status} for ${students.find(student => student.id === studentId).name}`);
    } catch (error) {
      setErrorMessage("Error marking attendance");
    }
  };

  return (
    <div className="attendance">
      <h1>Mark Attendance</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Grade and Section Select */}
      <div className="filter-container">
        <select value={grade} onChange={(e) => setGrade(e.target.value)}>
          <option value="">Select Grade</option>
          <option value="1">Grade 1</option>
          <option value="2">Grade 2</option>
          <option value="3">Grade 3</option>
          <option value="4">Grade 4</option>
          <option value="5">Grade 5</option>
          <option value="6">Grade 6</option>
          <option value="7">Grade 7</option>
          <option value="8">Grade 8</option>
          <option value="9">Grade 9</option>
          <option value="10">Grade 10</option>
        </select>

        <select value={section} onChange={(e) => setSection(e.target.value)}>
          <option value="">Select Section</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
          <option value="C">Section C</option>
        </select>
      </div>

      {/* List of Students */}
      <div className="student-list">
        {students.length > 0 ? (
          <ul>
            {students.map((student) => (
              <li key={student.id} className="student-item">
                <span>{student.name} (ID: {student.id})</span>
                <div className="attendance-buttons">
                  <button
                    onClick={() => handleIndividualAttendance(student.id, "Present")}
                    disabled={attendanceStatus[student.id] === "Present"}
                  >
                    Mark Present
                  </button>
                  <button
                    onClick={() => handleIndividualAttendance(student.id, "Absent")}
                    disabled={attendanceStatus[student.id] === "Absent"}
                  >
                    Mark Absent
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Select a grade and section to view students.</p>
        )}
      </div>
    </div>
  );
};

export default Attendance;
