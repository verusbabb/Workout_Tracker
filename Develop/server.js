const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
    useNewUrlParser: true
});

app.get("/api/workouts", async (req, res) => {
    try {
        const workouts = await db.Workout.find({});
        // const workoutdata = await workouts.json();
        res.send(workouts);
    } catch (error) {
        res.json(error)
    }
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});