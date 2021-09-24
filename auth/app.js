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
