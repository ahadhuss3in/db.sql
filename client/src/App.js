import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Attendance from "./components/Attendance";
import AcademicRecords from "./components/AcademicRecords";
import StudentInfo from "./components/StudentInfo";
import LibraryRecords from "./components/LibraryRecords";
import Guardians from "./components/Guardians";
import ViewStudents from "./components/ViewStudents"; // Added import for ViewStudents

function App() {
  return (
    <Router>
      <Navbar />
      <div className="content-container">
        <Routes>
          {/* Define Routes for different pages */}
          <Route path="/" element={<Home />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/academic-records" element={<AcademicRecords />} />
          <Route path="/student-info" element={<StudentInfo />} />
          <Route path="/library-records" element={<LibraryRecords />} />
          <Route path="/guardians" element={<Guardians />} />
          <Route path="/view-students" element={<ViewStudents />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
