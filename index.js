// Required Modules
const express = require("express");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ejs = require("ejs");
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require("path");
const expressSession = require('express-session');
const BlogPost = require('./models/BlogPost.js');
const authMiddleware = require('./middleware/authMiddleware.js');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')
const app = express();


const uri = "mongodb+srv://user:blogpassword@clusterblog.hpvfy.mongodb.net/my_database?retryWrites=true&w=majority"
const options = {
  useNewUrlParser: true, 
  useUnifiedTopology: true
};
mongoose.connect(uri, options);
mongoose.connection.on('connected',()=>{
  console.log("Connection successful.");
});

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

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

const viewPath = path.join(__dirname, "/views")
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set('views', viewPath);

const homeController = require('./controllers/home')
app.get("/",homeController);

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/post", (req, res) => {
  res.render("samplePost");
});

const newUserController = require('./controllers/newUser')
app.get("/auth/register",redirectIfAuthenticatedMiddleware, newUserController);

const getPostController = require('./controllers/getPost')
app.get('/post/:id', getPostController);

// Above form is simplified into below form using Middleware

const newPostController = require('./controllers/newPost')
app.get('/posts/new',authMiddleware,newPostController);

const getAllPostController = require('./controllers/getAllPost')
app.get('/', getAllPostController);

//Validation Middleware
const validationController = require('./controllers/validation')
const storeDataController = require('./controllers/storeData')
app.post('/posts/store',validationController, storeDataController)

const storeUserController = require('./controllers/storeUser')
app.post('/user/register',redirectIfAuthenticatedMiddleware, storeUserController)

const loginController = require('./controllers/login')
app.get('/auth/login',redirectIfAuthenticatedMiddleware,loginController)

const loginUserController = require('./controllers/loginUser')
app.post('/user/login',redirectIfAuthenticatedMiddleware,loginUserController)

const logoutController = require('./controllers/logout')
app.get('/user/logout',logoutController)

app.use((req, res) => res.render('notfound'));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("App started ...");
});