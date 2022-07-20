require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Bodyparser Middleware
app.use(bodyParser.json());

// DB Config
const db = process.env.MONGODB_URL;

//Import Routes
const articles = require("./routes/api/articles");

const authors = require("./routes/api/authors");
// const auth = require("./routes/api/auth");

// Connect to MongoDB
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

const port = process.env.PORT || 5000;

// Configure Routes
app.use("/articles/", articles);
app.use("/authors/", authors);
//app.use("/auth/", auth);

app.listen(port, () => console.log(`Server started on port ${port}`));