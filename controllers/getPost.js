const BlogPost = require('../models/BlogPost');
module.exports = async (req, res) => {  // : HERE REPRESENTS ANY NUMBER OF CHARACTER (ID)
    const blogpost = await BlogPost.findById(req.params.id).populate('userId');
    res.render("post", {
      blogpost
    });
}