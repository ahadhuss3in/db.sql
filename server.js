const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "student_db",
  password: "ahad",
  port: 5432,
});

// Routes

// Students CRUD
app.post("/students", async (req, res) => {
  const { name, age, section, grade } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO students (name, age, section, grade) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, age, section, grade]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.get("/students", async (req, res) => {
  const { search } = req.query;
  try {
    let query = "SELECT * FROM students";
    let params = [];

    if (search) {
      query += " WHERE name ILIKE $1 OR id::text ILIKE $1";
      params.push(`%${search}%`);
    }

    const result = await pool.query(query, params);
    res.json(result.rows); // Return the list of students
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// DELETE route to remove a student by ID and their related records
app.delete('/students/:id', async (req, res) => {
  const studentId = req.params.id;
  try {
    const result = await pool.query('DELETE FROM students WHERE id = $1', [studentId]);

    if (result.rowCount === 0) {
      await pool.query('ROLLBACK'); // Rollback if student not found
      return res.status(404).send('Student not found');
    }

    await pool.query('COMMIT'); // Commit transaction
    res.status(200).send({ message: 'Student and related records deleted successfully' });
  } catch (error) {
    await pool.query('ROLLBACK'); // Rollback in case of error
    console.error('Error deleting student and related records:', error);
    res.status(500).send('Server error');
  }
});

// Get student details with all related records
app.get("/student-details/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const studentResult = await pool.query("SELECT * FROM students WHERE id = $1", [id]);
    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const student = studentResult.rows[0];

    const studentInfoResult = await pool.query("SELECT * FROM student_info WHERE student_id = $1", [id]);
    const guardianResult = await pool.query("SELECT * FROM guardians WHERE student_id = $1", [id]);
    const libraryResult = await pool.query("SELECT * FROM library_records WHERE student_id = $1", [id]);
    const academicResult = await pool.query("SELECT * FROM academic_records WHERE student_id = $1", [id]);
    const attendanceResult = await pool.query("SELECT * FROM attendance WHERE student_id = $1", [id]);

    const studentInfo = studentInfoResult.rows.length > 0 ? studentInfoResult.rows[0] : null;
    const guardians = guardianResult.rows;
    const libraryRecords = libraryResult.rows;
    const academicRecords = academicResult.rows;
    const attendanceRecords = attendanceResult.rows;

    res.json({
      student,
      studentInfo,
      guardians,
      libraryRecords,
      academicRecords,
      attendanceRecords,
    });

  } catch (err) {
    console.error('Error fetching student details:', err);
    res.status(500).json(err.message);
  }
});

// Attendance
app.post("/attendance", async (req, res) => {
  const { student_id, status } = req.body;
  const currentDate = new Date().toISOString().split("T")[0];

  try {
    const result = await pool.query(
      "SELECT * FROM attendance WHERE student_id = $1 AND date = $2",
      [student_id, currentDate]
    );

    if (result.rows.length > 0) {
      return res.status(400).json({ message: "Attendance for today is already marked." });
    }

    const insertResult = await pool.query(
      "INSERT INTO attendance (student_id, status, date) VALUES ($1, $2, $3) RETURNING *",
      [student_id, status, currentDate]
    );

    res.json(insertResult.rows[0]);
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json(err.message);
  }
});

app.get("/attendance/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM attendance WHERE student_id = $1",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Academic Records
app.post("/academic-records", async (req, res) => {
  const { student_id, subject_id, subject_name, marks } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO academic_records (student_id, subject_id, subject_name, marks) VALUES ($1, $2, $3, $4) RETURNING *",
      [student_id, subject_id, subject_name, marks]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.get("/academic-records/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM academic_records WHERE student_id = $1",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Student Information
app.post("/student-info", async (req, res) => {
  const { student_id, admission_number, join_date, fees } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO student_info (student_id, admission_number, join_date, fees) VALUES ($1, $2, $3, $4) RETURNING *",
      [student_id, admission_number, join_date, fees]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.get("/student-info/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM student_info WHERE student_id = $1",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Library Records
app.post("/library-records", async (req, res) => {
  const { student_id, book_name, issue_date, due_date } = req.body;
  try {
    // Start a transaction
    await pool.query("BEGIN");

    // Insert the new library record
    const result = await pool.query(
      "INSERT INTO library_records (student_id, book_name, issue_date, due_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [student_id, book_name, issue_date, due_date]
    );

    // Increase the student's fees by 30
    const feeUpdateResult = await pool.query(
      "UPDATE student_info SET fees = COALESCE(fees, 0) + 30 WHERE student_id = $1 RETURNING fees",
      [student_id]
    );

    if (feeUpdateResult.rowCount === 0) {
      throw new Error("Failed to update fees. Student record not found.");
    }

    // Commit the transaction
    await pool.query("COMMIT");

    // Return the updated library record and the new fees
    res.json({
      libraryRecord: result.rows[0],
      updatedFees: feeUpdateResult.rows[0].fees,
    });
  } catch (err) {
    // Rollback the transaction in case of error
    await pool.query("ROLLBACK");
    console.error("Error adding library record and updating fees:", err.message);
    res.status(500).json({ message: "Failed to add library record and update fees", error: err.message });
  }
});

app.get("/library-records/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM library_records WHERE student_id = $1",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// DELETE route to remove a specific library record by student_id and book_name
app.delete("/library-records/:student_id/:book_name", async (req, res) => {
  const { student_id, book_name } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM library_records WHERE student_id = $1 AND book_name = $2 RETURNING *",
      [student_id, book_name]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Library record not found" });
    }
    res.json({ message: "Library record deleted successfully" });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Guardians
app.post("/guardians", async (req, res) => {
  const { student_id, name, relationship, contact_number } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO guardians (student_id, name, relationship, contact_number) VALUES ($1, $2, $3, $4) RETURNING *",
      [student_id, name, relationship, contact_number]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.get("/guardians/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM guardians WHERE student_id = $1",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
