var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var assert = require('assert');
const passport=require("passport");
const LocalStrategy=require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
var app=express();

var url = 'mongodb+srv://admin:admin123@cluster0.fayua.mongodb.net/expense-tracker?retryWrites=true&w=majority';
mongoose.connect(url);


app.use(require("express-session")({
  secret:"Any normal Word",//decode or encode session
      resave: false,          
      saveUninitialized:false    
  }));


var Schema = mongoose.Schema;
const UserSchema = new mongoose.Schema({
    fullname:String,
    username:String,
    password:String,
}) ;

UserSchema.plugin(passportLocalMongoose);
var expDataSchema = new Schema({
  item: { type: String, required: true },
  expense: { type: Number, required: true },
  category: { type: String, required: true }
}, { collection: 'exp-data', timestamps: true });

module.exports = mongoose.model("User",UserSchema);
User=require("../routes/index.js");

var expData = mongoose.model('ExpData', expDataSchema);

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/home', function (req, res, next) {
  res.redirect('/');
})

router.get('/expenses', function (req, res, next) {
  res.render('expense');
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/insert', function (req, res, next) {
  var ins = {
    item: req.body.item,
    expense: req.body.cost,
    category: req.body.cat
  }

  var data = new expData(ins);
  var id = data.id;
  data.save();
  res.redirect('/');
});
router.post('/update', function (req, res, next) {
  var ins = {
    item: req.body.item,
    expense: req.body.cost,
  }
  
  var id = req.body.id;

  expData.findById(id, (err, upt) => {
    if (err) {
      console.error('no entry found');
    }
    upt.item = req.body.item;
    upt.expense = req.body.cost;
    upt.save();
  })
  res.redirect('/');
});
router.post('/delete', function (req, res, next) {
  var id = req.body.id;
  expData.findByIdAndRemove(id).exec();
  res.redirect('/');
});



passport.serializeUser(User.serializeUser());       
passport.deserializeUser(User.deserializeUser());   
passport.use(new LocalStrategy(User.authenticate()));

app.set("view engine","ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

app.use(require("express-session")({
    secret:"Any normal Word",       //decode or encode session
    resave: false,          
    saveUninitialized:false    
}));

app.set("view engine","ejs");

//routes
app.get("/", (req,res) =>{
    res.render("index");
})
app.get("../views/index" ,(req,res) =>{
    res.render("index");
})
//Auth Routes
app.get("../views/login",(req,res)=>{
    res.render("login");
});

app.post("../views/login",passport.authenticate("local",{
    successRedirect:"../views/index.ejs",
    failureRedirect:"../views/login.ejs"

}),(req,res)=>{
    
});


app.get("../views/signup",(req,res)=>{
    res.render("signup");
});

app.post("../views/signup",(req,res)=>{
    
User.register(new User({fullname: req.body.fullname,username: req.body.username,password:req.body.password}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("signup");
        }
    passport.authenticate("local")(req,res,function(){
        res.redirect("./views/login");
    })    
    })
})

app.get("../views/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("./views/login");
}


module.exports = router;
