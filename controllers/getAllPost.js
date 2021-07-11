module.exports = async(req, res) => {
    const blogposts = await BlogPost.find({}).populate('userId');
    res.render('index', {
      blogposts 
    });
}