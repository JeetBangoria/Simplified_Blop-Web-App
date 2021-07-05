module.exports = async (req, res) => {
    let image = req.files.image;
    image.mv(path.resolve(__dirname, 'public/img', image.name), async (error) => {
      console.log(req.body);
      await BlogPost.create({
        ...req.body,
        image: '/img/' + image.name
      })
      res.redirect('/')
    })
}