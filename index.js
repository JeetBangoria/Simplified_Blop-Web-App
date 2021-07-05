const express = require("express");
const ejs = require("ejs");
const app = express();
const fileUpload = require('express-fileupload')
var bodyParser = require('body-parser');
const path = require("path");

const viewPath = path.join(__dirname, "/views")

app.use(fileUpload())

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set('views', viewPath);

const BlogPost = require('./models/BlogPost.js')
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/my_database", { useNewUrlParser: true });

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const blogposts = await BlogPost.find({})
  res.render("index", {
    blogposts
  });
  console.log(blogposts)
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get('/post/:id', async (req, res) => {
  const blogpost = await BlogPost.findById(req.params.id);
  res.render("post", {
    blogpost
  });
});

const newPostController = require('./controllers/newPost')
app.get('/posts/new',newPostController);

//Validation Middleware

const validation = (req, res, next) => {
  if (req.files == null || req.body.title == null || req.body.title == null) {
    return res.redirect('/posts/new')
  }
  next()
}

app.use('/posts/store',validation)

app.post('/posts/store', async (req, res) => {
  let image = req.files.image;
  image.mv(path.resolve(__dirname, 'public/img', image.name), async (error) => {
    console.log(req.body);
    await BlogPost.create({
      ...req.body,
      image: '/img/' + image.name
    })
    res.redirect('/')
  })
})

app.get('/', async (req, res) => {
  const blogposts = await BlogPost.find({})
  res.render('index', {
    blogposts: blogposts
  });
})

app.listen(4000, () => {
  console.log("This App is on port = 4000");
});
