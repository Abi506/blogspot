const express = require("express");
const multer = require("multer");
const path = require('path');
const Temp_blog = require("../models/tempBlogPost");
const router = express.Router();
const verifyToken=require("../middlewares/auth");
const { verify } = require("crypto");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../images'));
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

router.post('/', verifyToken,upload.single('file'), async (req, res) => {
    const decoded_username=req.user
    console.log(decoded_username.username,'username decoded')
    const newPost = new Temp_blog({
        title: req.body.title, // Ensure the field name matches
        content: req.body.content, // Note: You might want to parse this as JSON on the backend
        photo: `/images/${req.file.filename}`, // This should now work correctly
        username: decoded_username.username
    });
    console.log(newPost,'newPost')
    try {
        const savedPost = await newPost.save();
        res.json(savedPost);
    } catch (error) {
        res.json(error);
    }
});

// Route to get all posts
router.get('/', verifyToken, async (req, res) => {
    try {
      const { search, sort } = req.query;
  
      // Initialize query object
      let query = {};
  
      // If search term is provided, search in title or username fields
      if (search) {
        query = {
          $or: [
            { title: { $regex: search, $options: 'i' } }, // Case-insensitive search in title
            { username: { $regex: search, $options: 'i' } } // Case-insensitive search in username
          ]
        };
      }
  
      // Initialize sorting object
      let sortQuery = {};
  
      // Handle different sorting options
      if (sort === 'title') {
        sortQuery = { title: 1 }; // Sort by title in ascending order
      } else if (sort === 'author') {
        sortQuery = { username: 1 }; // Sort by username (author) in ascending order
      } else if (sort === 'date') {
        sortQuery = { createdAt: -1 }; // Sort by date in descending order (newest first)
      }
  
      // Fetch posts from the database with optional search and sorting
      const posts = await Temp_blog.find(query).sort(sortQuery);
  
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err });
    }
  });

//Route to get particular post
router.get("/blog/:id",verifyToken, async (req, res) => {
    console.log(req.params.id,'request params')
    try {
        const post = await Temp_blog.find({_id:req.params.id});
        console.log(post,'post...................................................................')
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }
        res.json({ post });
    } catch (err) {
        console.error("Error fetching post:", err);
        res.status(500).json({ msg: err });
    }
});
//my-blogs
router.get('/my-blog',verifyToken,async(req,res)=>{
    const decoded_username=req.user 
    console.log(decoded_username.username,'username...............................')
    try{
        const posts=await Temp_blog.find({username:decoded_username.username})
        res.status(200).json(posts);
    }
    catch(error){
        res.status(500).json({msg:error})
    }
})

module.exports = router;
