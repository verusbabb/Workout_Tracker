const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3001;

const db = require("./models");
const e = require("express");

const app = express();

app.use(logger("dev"));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
});

// WORKING route to get latest workout with TOTAL DURATION
app.get("/api/workouts", async (req, res) => {
  try {
    const lastWorkout = await db.Workout.find({});

    res.json(lastWorkout);
  } catch (error) {
    res.json(error);
  }
});

//put route for adding exercise
app.put("/api/workouts/:id", async (req, res) => {
  try {
    // console.log(req.body);
    const exerciseUpdate = await db.Workout.findOneAndUpdate(
      { _id: req.params.id },
      {
        $inc: { totalDuration: req.body.duration },
        $push: { exercises: req.body },
      },
      { new: true }
    );
    res.json(exerciseUpdate);
  } catch (error) {
    res.json(error);
  }
});

// route all workouts in range
app.get("/api/workouts/range", async (req, res) => {
  try {
    const inRange = await db.Workout.find({}).sort({ day: 1 });

    inRange.forEach((workout) => {
      let total = 0;
      workout.exercises.forEach((e) => {
        total += e.duration;
      });
      workout.totalDuration = total;
    });
    res.json(inRange);
  } catch (error) {
    res.json(error);
  }
});

// route to create new workout
app.post("/api/workouts", async (req, res) => {
  try {
    body = req.body;
    const newWorkout = await db.Workout.create(body);
    res.json(newWorkout);
  } catch (error) {
    res.json(error);
  }
});

//html routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/exercise.html"));
});

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/stats.html"));
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
