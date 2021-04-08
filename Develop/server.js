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

// route to get latest workout
// app.get("/api/workouts", async (req, res) => {
//     try {
//         const lastWorkout = await db.Workout.find({})
//         res.send(lastWorkout);
//     } catch (error) {
//         res.json(error)
//     }
// });

// route to get latest workout with total duration
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

// route all workouts in range (SHOULD BE RETURNING DATA FOR DASHBOARD BUT ROUTE NOT WORKING)
app.get("/api/workouts/range", async (req, res) => {
  try {
    const inRange = await db.Workout.find({});
    res.json(inRange);
  } catch (error) {
    res.json(error);
  }
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
