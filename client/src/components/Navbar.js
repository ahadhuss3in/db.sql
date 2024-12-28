import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="navbar-title">Student Management System</h2>
      <div className="nav-links">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/attendance">Attendance</Link>
        <Link className="nav-link" to="/academic-records">Academic Records</Link>
        <Link className="nav-link" to="/student-info">Student Info</Link>
        <Link className="nav-link" to="/library-records">Library</Link>
        <Link className="nav-link" to="/guardians">Guardians</Link>
        <Link className="nav-link" to="/view-students">View Students</Link>
      </div>
    </nav>
  );
};

export default Navbar;
