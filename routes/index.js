var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var assert = require('assert');
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
module.exports = mongoose.model("User",UserSchema);
var expDataSchema = new Schema({
  item: { type: String, required: true },
  expense: { type: Number, required: true },
  category: String
}, { collection: 'exp-data' });

var expData = mongoose.model('ExpData', expDataSchema);

router.get('/', function (req, res, next) {
  res.render('index');
});
router.get('/home', function (req, res, next) {
  res.redirect('/');
} )
router.get('/expenses', function (req, res, next) {
  expData.find()
    .then((exp) => {
      res.send('Data')
    })
  res.send('Total expense = 0');
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

module.exports = router;
