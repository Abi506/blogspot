const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, './images')));

// Route file imports
const authRoute = require('./routes/auth');
const blog_post_route = require("./routes/posts");
const contact_route=require("./routes/contact")
const profile_route=require("./routes/profile")
//temp file
const temp_route=require("./routes/tempPosts")

// Connect to MongoDB
mongoose.connect(process.env.mongo_url)
  .then(() => console.log("Mongodb connected successfully"))
  .catch(error => console.log("Error while connecting to MongoDB", error));


// Routes
app.use('/', authRoute);
app.use("/post", blog_post_route);
app.use('/temp',temp_route)
app.use('/contact',contact_route)
app.use('/profile',profile_route)
// Start the server
app.listen(process.env.port, () => {
  console.log("Server is running on localhost", process.env.port);
});
