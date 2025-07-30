const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const Cohort = require("./models/Cohort.model");
const Student = require("./models/Student.model");

const cors = require("cors");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));


// INITIALIZE EXPRESS APP 
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// ROUTES - 
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

//
//STUDENT ROUTES
//

//POST /api/students -- Creates a new student
app.post("/api/students", (req, res) => {
  const newStudent = req.body

  Student.create(newStudent)
    .then((studentFromDB) => {
      res.status(201).json(studentFromDB);
    })
    .catch((error) => {
      console.log(" Error creating a new student in the DB...", error);
      res.status(500).json({ error: 'Failed to create a new student' });
    });
})

//GET /api/students
app.get("/api/students", (req, res) => {
  Student.find()
    .populate("cohort")
    .then(students => res.status(200).json(students))
    .catch(err => res.status(500).json({ error: "Failed to fetch students" }));
});


// GET /api/students/:studentId
app.get("/api/students/:studentId", (req, res) => {

  let { studentId } = req.params

  Student.findById(studentId)
    .populate("cohort")
    .then(students => res.status(200).json(students))
    .catch(err => res.status(500).json({ error: "Failed to fetch students" }));
});

//PUT /api/students/:studentId - Updates a specific student by id
app.put("/api/students/:studentId", (req, res) => {

  let { studentId } = req.params

  const newDetails = req.body

  Student.findByIdAndUpdate(studentId, newDetails, { new: true })
    .populate("cohort")
    .then((studentFromDB) => {
      res.status(201).json(studentFromDB);
    })
    .catch((error) => {
      console.log(" Error updating a student in the DB...", error);
      res.status(500).json({ error: 'Failed to update student' });
    });
});

//DELETE /api/students/:studentId - Deletes a specific student by id
app.delete("/api/students/:studentId", (req, res) => {

  let { studentId } = req.params

  Student.findByIdAndDelete(studentId)
    .populate("cohort")
    .then((studentFromDB) => {
      res.status(201).json(studentFromDB);
    })
    .catch((error) => {
      console.log(" Error deleting student in the DB...", error);
      res.status(500).json({ error: 'Failed to delete a student' });
    });
});


// GET /api/students/cohort/:cohortId - Retrieves all of the students for a given cohort
app.get("/api/students/cohort/:cohortId", (req, res) => {

  let { cohortId } = req.params

  Student.find({ cohort: cohortId })
    .populate("cohort")
    .then(students => res.status(200).json(students))
    .catch(err => res.status(500).json({ error: "Failed to fetch students" }));
});


//
//COHORT ROUTES
//

//POST /api/cohorts - Creates a new cohort
app.post("/api/cohorts", (req, res) => {

  const newCohort = req.body

  Cohort.create(newCohort)
    .then((cohortFromDB) => {
      res.status(201).json(cohortFromDB)
    })
    .catch((err) => {
      console.log("Error creating a new cohort in the DB...")
      console.log(err)
      res.status(500).json({ error: "Failed to create a new cohort" })
    })
})


//GET /api/cohorts - Retrieves all of the cohorts in the database collection
app.get("/api/cohorts", (req, res) => {
  Cohort.find()
    .then(cohorts => res.status(200).json(cohorts))
    .catch(err => res.status(500).json({ error: "Failed to fetch cohorts" }));
});

//GET /api/cohorts/:cohortId - Retrieves a specific cohort by id
app.get("/api/cohorts/:cohortId", (req, res) => {

  let { cohortId } = req.params

  Cohort.findById(cohortId)
    .then(cohorts => res.status(200).json(cohorts))
    .catch(error => {
      console.log("Error getting cohort details from DB...");
      console.log(error);
      res.status(500).json({ error: "Failed to get cohort details" });
    })
});

//PUT /api/cohorts/:cohortId - Updates a specific cohort by id
app.put("/api/cohorts/:cohortId", (req, res) => {

  let { cohortId } = req.params

  const newDetails = req.body

  Cohort.findByIdAndUpdate(cohortId, newDetails, { new: true })
    .then(cohorts => res.status(200).json(cohorts))
    .catch(error => {
      console.log("Error updating cohort details from DB...");
      console.log(error);
      res.status(500).json({ error: "Failed to update cohort details" });
    })
});

//DELETE /api/cohorts/:cohortId - Deletes a specific cohort by id
app.delete("/api/cohorts/:cohortId", (req, res) => {

  let { cohortId } = req.params

  Cohort.findByIdAndDelete(cohortId)
    .then(cohorts => res.status(200).json(cohorts))
    .catch(error => {
      console.log("Error deleting cohort details from DB...");
      console.log(error);
      res.status(500).json({ error: "Failed to delete cohort details" });
    })
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
