// Required Modules
const express = require("express");
const bcrypt = require('bcrypt');
const ejs = require("ejs");
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require("path");
const expressSession = require('express-session');
const BlogPost = require('./models/BlogPost.js');
const authMiddleware = require('./middleware/authMiddleware.js');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/my_database", { useNewUrlParser: true });
const app = express();

global.loggedIn = null;

app.use(expressSession({
  secret: 'keyboard cat',
}))

app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  next();
});

app.use(fileUpload());

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const viewPath = path.join(__dirname, "/views")
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set('views', viewPath);


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

app.get("/post", (req, res) => {
  res.render("samplePost");
});

app.get("/auth/register",redirectIfAuthenticatedMiddleware, (req, res) => {
  res.render("register");
});

app.get('/post/:id', async (req, res) => {  // : HERE REPRESENTS ANY NUMBER OF CHARACTER (ID)
  const blogpost = await BlogPost.findById(req.params.id);
  res.render("post", {
    blogpost
  });
});

// Above form is simplified into below form using Middleware

const newPostController = require('./controllers/newPost')
app.get('/posts/new',authMiddleware,newPostController);

const getAllPostController = require('./controllers/getAllPost')
app.get('/', getAllPostController)

//Validation Middleware
const validationController = require('./controllers/validation')
app.use('/posts/store',validationController)

const storeDataController = require('./controllers/storeData')
app.post('/posts/store', storeDataController)

const storeUserController = require('./controllers/storeUser')
app.post('/user/register',redirectIfAuthenticatedMiddleware, storeUserController)

const loginController = require('./controllers/login')
app.get('/auth/login',redirectIfAuthenticatedMiddleware,loginController)

const loginUserController = require('./controllers/loginUser')
app.post('/user/login',redirectIfAuthenticatedMiddleware,loginUserController)

const logoutController = require('./controllers/logout')
app.get('/user/logout',logoutController)

app.listen(4000, () => {
  console.log("This App is on port = 4000");
});

app.use((req, res) => res.render('notfound'));