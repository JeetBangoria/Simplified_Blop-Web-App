// Required Modules
const express = require("express");
require("dotenv").config();
const bcrypt = require('bcrypt');
const ejs = require("ejs");
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require("path");
const expressSession = require('express-session');
const flash = require('connect-flash');
const BlogPost = require('./models/BlogPost.js');
const authMiddleware = require('./middleware/authMiddleware.js');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });
const app = express();
app.use(flash());

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

const homeController = require('./controllers/home')
app.get("/", homeController);

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/post", (req, res) => {
  res.render("samplePost");
});

const getPostController = require('./controllers/getPost')
app.get('/post/:id', getPostController);

// Above form is simplified into below form using Middleware

const newPostController = require('./controllers/newPost')
app.get('/posts/new', authMiddleware, newPostController);

const getAllPostController = require('./controllers/getAllPost')
app.get('/', getAllPostController);

//Validation Middleware
const validationController = require('./controllers/validation')
const storeDataController = require('./controllers/storeData')
app.post('/posts/store', validationController, storeDataController)

const newUserController = require('./controllers/newUser')
app.get("/auth/register", redirectIfAuthenticatedMiddleware, newUserController);

const storeUserController = require('./controllers/storeUser')
app.post('/user/register', redirectIfAuthenticatedMiddleware, storeUserController)

const loginController = require('./controllers/login')
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController)

const loginUserController = require('./controllers/loginUser')
app.post('/user/login', redirectIfAuthenticatedMiddleware, loginUserController)

const logoutController = require('./controllers/logout')
app.get('/user/logout', logoutController)

let port = process.env.PORT||4000
app.listen(port, ()=>{
console.log('App listening...')
})

app.use((req, res) => res.render('notfound'));