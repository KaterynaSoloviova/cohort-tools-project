const router = require("express").Router()

const Student = require("../models/Student.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");


//POST /api/students -- Creates a new student
router.post("/api/students", isAuthenticated, (req, res) => {
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
router.get("/api/students", isAuthenticated, (req, res) => {
    Student.find()
        //.populate("cohort")
        .then(studentsFromDB => res.status(200).json(studentsFromDB))
        .catch((error) => {
            console.log(" Error getting students in the DB...", error);
            res.status(500).json({ error: 'Failed to getting students' });
        });
});

// GET /api/students/:studentId
router.get("/api/students/:studentId", isAuthenticated, (req, res) => {

    let { studentId } = req.params

    Student.findById(studentId)
        //.populate("cohort")
        .then(studentFromDB => res.status(200).json(studentFromDB))
        .catch((error) => {
            console.log(" Error getting student in the DB...", error);
            res.status(500).json({ error: 'Failed to getting student' });
        });
});

//PUT /api/students/:studentId - Updates a specific student by id
router.put("/api/students/:studentId", isAuthenticated, (req, res) => {

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
router.delete("/api/students/:studentId", isAuthenticated, (req, res) => {

    let { studentId } = req.params

    Student.findByIdAndDelete(studentId)
        // .populate("cohort")
        .then((studentFromDB) => {
            res.status(201).json(studentFromDB);
        })
        .catch((error) => {
            console.log(" Error deleting student in the DB...", error);
            res.status(500).json({ error: 'Failed to delete a student' });
        });
});

// GET /api/students/cohort/:cohortId - Retrieves all of the students for a given cohort
router.get("/api/students/cohort/:cohortId", isAuthenticated, (req, res) => {

    let { cohortId } = req.params

    Student.find({ cohort: cohortId })
        //  .populate("cohort")
        .then(students => res.status(200).json(students))
        .catch((error) => {
            console.log(" Error getting students for a given cohort in the DB...", error);
            res.status(500).json({ error: 'Failed to getting students for a given cohort' });
        });
});


module.exports = router