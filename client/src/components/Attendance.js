import React, { useState, useEffect } from "react";
import axios from "axios";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch students list from the backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/students");
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  // Handle attendance submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const studentId in attendanceStatus) {
      try {
        await axios.post("http://localhost:5000/attendance", {
          student_id: studentId,
          status: attendanceStatus[studentId],
        });
      } catch (error) {
        if (error.response && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("There was an error marking attendance.");
        }
      }
    }

    setAttendanceStatus({}); // Clear the form after submission
    setErrorMessage(""); // Clear any error messages
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceStatus({
      ...attendanceStatus,
      [studentId]: status,
    });
  };

  return (
    <div className="attendance">
      <h1>Mark Attendance</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        {students.map((student) => (
          <div key={student.id} className="student-attendance">
            <span>{student.name}</span>
            <select
              value={attendanceStatus[student.id] || ""}
              onChange={(e) =>
                handleStatusChange(student.id, e.target.value)
              }
              required
            >
              <option value="">Select Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        ))}
        <button type="submit">Submit Attendance</button>
      </form>
    </div>
  );
};

export default Attendance;

