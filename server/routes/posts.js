const express = require('express');
const router = express.Router();
const Post = require("../models/Post");

// Create post
router.post("/", async (req, res) => {
    console.log("Received data", req.body);

    try {
        const newPost = new Post({
            title: req.body.title,
            desc: req.body.content.map(item => item.text).join("\n"),
            photo: req.body.image || "", // Ensure photo is a string
            username: req.body.username || "defaultUser",
            categories: req.body.categories || []
        });

        const savedPost = await newPost.save(); // Use the save method
        console.log("Saved Post:", savedPost);
        res.json({ msg: "Blog upload successful", post: savedPost });
    } catch (error) {
        console.error("Error saving the post:", error);
        res.status(500).json({ msg: "Error while uploading blog", error });
    }
});

// GET POST by ID
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }
        res.json({ post });
    } catch (err) {
        console.error("Error fetching post:", err);
        res.status(500).json({ msg: err });
    }
});

// GET ALL POSTS
router.get("/", async (req, res) => {
    const username = req.query.user;
    const catName = req.query.cat;
    try {
        let posts;
        if (username) {
            posts = await Post.find({ username });
        } else if (catName) {
            posts = await Post.find({ categories: { $in: [catName] } });
        } else {
            posts = await Post.find();
        }
        res.json({ msg: posts });
    } catch (err) {
        console.error("Error fetching all posts:", err);
        res.status(500).json({ msg: err });
    }
});

module.exports = router;