//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const md5 = require("md5");
//const bcrypt = require("bcrypt");
const saltRounds = 10;
// const encrypt = require("mongoose-encryption");


// Connection URL
const app = express();

// console.log(process.env.API_KEY);
// Database Name
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

// const secret = "Thisisourlittlesecret.";

// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req,res) {
  res.render("home");
});

app.get("/login", function(req,res) {
  res.render("login");
});

app.get("/register", function(req,res) {
  res.render("register");
});


app.post("/register", function(req,res) {
  bcrypt.hash(req.body.password, saltRounds, function(err,hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });

});

app.post("/login",function(req,res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err,foundUser){
    if(err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password,foundUser.password,function(err,result) {
            if (result === true) {
        res.render("secrets");
            }
        });

      }
    }
  });
});
// Create a new MongoClient

// Use connect method to connect to the Server
app.listen(3000, function() {

  console.log("Server started on port 3000");

});
