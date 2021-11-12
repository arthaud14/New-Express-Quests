// Setup the environement variables form a .env file
require("dotenv").config();
const connection = require("./db-config");

// Import expres
const express = require("express");

// We store all express methods in a variable called app
const app = express();

// If an environment variable named PORT exists, we take it in order to let the user change the port without chaning the source code. Otherwise we give a default value of 3000
const port = process.env.PORT || 3000;

// We listen to incoming request on the port defined above

connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
  } else {
    console.log(
      "connected to database with threadId :  " + connection.threadId
    );
  }
});
app.use(express.json());

connection.query("SELECT * FROM movies", (err, results) => {
  // Do something when mysql is done executing the query
  console.log(err, results);
});

app.get("/api/movies", (req, res) => {
  connection.query("SELECT * FROM movies", (err, result) => {
    if (err) {
      res.status(500).send("Error retrieving data from database");
    } else {
      res.status(200).json(result);
    }
  });
});

app.post("/api/movies", (req, res) => {
  const { title, director, year, color, duration } = req.body;
  connection.query(
    "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
    [title, director, year, color, duration],
    (err, result) => {
      if (err) {
        res.status(500).send("Error saving the movie");
      } else {
        res.status(201).send("Movie successfully saved");
      }
    }
  );
});

app.post("/api/movies", (req, res) => {
  console.log(req.body);
  res.send("Post route is working 🎉");
});

app.get("/api/users", (req, res) => {
  console.log(req.body);
  res.send("The Route is good");
});

app.post("/api/users", (req, res) => {
  const { firstname, lastname, email } = req.body;
  connection.query(
    "INSERT INTO users(firstname, lastname, email) VALUES(?, ?, ?)",
    [firstname, lastname, email],
    (err, result) => {
      if (err) {
        res.status(500).send("Error saving the user");
      } else {
        res.status(201).send("User successfull saved");
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
