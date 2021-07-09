const path = require('path');
const BlogPost = require('../models/BlogPost');
const User = require('../models/User');

module.exports = async (req, res) => {
    let image = req.files.image;
    const {username} = req.body;
    image.mv(path.resolve(__dirname, 'public/img', image.name), async (error) => {
      console.log(req.body);
      await BlogPost.create({
        ...req.body,
        image: '/img/' + image.name,
        userid: req.session.userId,
      })
      res.redirect('/')
  })
}