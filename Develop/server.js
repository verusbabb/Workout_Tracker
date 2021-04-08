const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

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

    lastWorkout.forEach((workout) => {
      let total = 0;
      workout.exercises.forEach((e) => {
        total += e.duration;
      });
      workout.totalDuration = total;
    });
    res.json(lastWorkout);
  } catch (error) {
    res.json(error);
  }
});

// NOT WORKING route all workouts in range
app.get("/api/workouts/range", async (req, res) => {
  try {
    const inRange = await db.Workout.find({});
    res.json(inRange);
  } catch (error) {
    res.json(error);
  }
});

// NOT WORKING: route to create new workout
app.post("/api/workouts", async (req, res) => {
  try {
    const newWorkout = await db.Workout.create(body);
    res.json(newWorkout);
  } catch (error) {
    res.json(error);
  }
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
