const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;

// Load environment variables
require("dotenv").config();



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

// Mount Routes

//Student
app.use("/", require("./routes/student.routes.js"))

//Cohort
app.use("/", require("./routes/cohort.routes.js"))

//Auth
app.use("/auth", require("./routes/auth.routes.js"))

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
