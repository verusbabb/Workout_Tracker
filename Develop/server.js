const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workoutdb", { useNewUrlParser: true });

// app.get("/api/workouts", (req, res) => {
//     console.log(res.body);
//     db.Workout.find({})
//     .then(dbWorkout => {
//         res.json(dbWorkout);
//     })
//     .catch(err => {
//         res.json(err);
//     });
// });

app.get("/api/workouts", (req, res) => {
    console.log(req, res);
    db.Workout.find({}, (err, workouts) => {
        if(err){
            console.log(err);
        } else {
            res.json(workouts)
        }
    });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});