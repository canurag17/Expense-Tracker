const express=require('express'),
      app=express(),
      mongoose=require("mongoose"),
      passport=require("passport"),
      bodyParser=require("body-parser"),
      LocalStrategy=require("passport-local"),
      passportLocalMongoose=require("passport-local-mongoose"),
      User=require("./views/index");

// app.listen(process.env.PORT ||3000,function (err) {
//     if(err){
//        console.log(err);
//     }else {
//     console.log("Server Started At Port 3000");  }});
var url = 'mongodb+srv://admin:admin123@cluster0.fayua.mongodb.net/expense-tracker?retryWrites=true&w=majority';
mongoose.connect(url);


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
app.get("./views/index" ,(req,res) =>{
    res.render("index");
})
//Auth Routes
app.get("./views/login",(req,res)=>{
    res.render("login");
});

app.post("./views/login",passport.authenticate("local",{
    successRedirect:"./views/index",
    failureRedirect:"./views/login"

}),(req,res)=>{
    
});


app.get("./views/signup",(req,res)=>{
    res.render("signup");
});

app.post("./views/signup",(req,res)=>{
    
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

app.get("./views/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("./views/login");
}
