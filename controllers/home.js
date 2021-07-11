const path = require('path');
const BlogPost = require('../models/BlogPost');
module.exports = async (req, res) => {
    const blogposts = await BlogPost.find({}).populate('userId');
    res.render("index", {
      blogposts
    });
    console.log(blogposts)
}