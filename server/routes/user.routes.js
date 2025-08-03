const router = require("express").Router();

const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// GET /api/users/:id - Retrieves a specific user by id (PROTECTED)
router.get("/api/users/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((userFromDB) => {
      if (!userFromDB) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send the password in the response
      const { password, ...userWithoutPassword } = userFromDB.toObject();
      res.status(200).json(userWithoutPassword);
    })
    .catch((error) => {
      console.log("Error getting user from DB...", error);
      res.status(500).json({ error: "Failed to get user" });
    });
});

module.exports = router; 