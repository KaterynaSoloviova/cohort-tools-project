const router= require("express").Router()
const Cohort = require("../models/Cohort.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

//POST /api/cohorts - Creates a new cohort
router.post("/api/cohorts", isAuthenticated, (req, res) => {

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
router.get("/api/cohorts", isAuthenticated, (req, res) => {
  Cohort.find()
    .then(cohortsFromDB => res.status(200).json(cohortsFromDB))
    .catch((error) => {
            console.log(" Error getting cohorts in the DB...", error);
            res.status(500).json({ error: 'Failed to getting cohorts' });
        });
});

//GET /api/cohorts/:cohortId - Retrieves a specific cohort by id
router.get("/api/cohorts/:cohortId", isAuthenticated, (req, res) => {

  let { cohortId } = req.params

  Cohort.findById(cohortId)
    .then(cohortFromDB => res.status(200).json(cohortFromDB))
    .catch(error => {
      console.log("Error getting cohort details from DB...");
      console.log(error);
      res.status(500).json({ error: "Failed to get cohort details" });
    })
});

//PUT /api/cohorts/:cohortId - Updates a specific cohort by id
router.put("/api/cohorts/:cohortId", isAuthenticated, (req, res) => {

  let { cohortId } = req.params

  const newDetails = req.body

  Cohort.findByIdAndUpdate(cohortId, newDetails, { new: true })
    .then(cohortFromDB => res.status(200).json(cohortFromDB))
    .catch(error => {
      console.log("Error updating cohort details from DB...");
      console.log(error);
      res.status(500).json({ error: "Failed to update cohort details" });
    })
});

//DELETE /api/cohorts/:cohortId - Deletes a specific cohort by id
router.delete("/api/cohorts/:cohortId", isAuthenticated, (req, res) => {

  let { cohortId } = req.params

  Cohort.findByIdAndDelete(cohortId)
    .then(cohortFromDB => res.status(200).json(cohortFromDB))
    .catch(error => {
      console.log("Error deleting cohort details from DB...");
      console.log(error);
      res.status(500).json({ error: "Failed to delete cohort details" });
    })
});

module.exports= router