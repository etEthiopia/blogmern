require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const path = require("path");


const app = express();

// Bodyparser Middleware
app.use(express.json());

// Static Stoarge
app.use("/images", express.static(path.join(__dirname, "/images")));


// DB Config
const db = process.env.MONGODB_URL;

//Import Routes
const articles = require("./routes/api/articles");
const ads = require("./routes/api/ads");
const authors = require("./routes/api/authors");
const admins = require("./routes/api/admins");
const categories = require("./routes/api/categories");
const comments = require("./routes/api/comments");
const auth = require("./routes/api/auth");

// Connect to MongoDB
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

const port = process.env.PORT || 5000;

// Configure Routes
app.use("/articles/", articles);
app.use("/ads/", ads);
app.use("/authors/", authors);
app.use("/admins/", admins);
app.use("/categories/", categories);
app.use("/comments/", comments);
app.use("/auth/", auth);


app.listen(port, () => console.log(`Server started on port ${port}`));