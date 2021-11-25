
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose = require('mongoose');
const encrypt=require("mongoose-encryption");

const app=express();


app.use(bodyParser.urlencoded({extended:true}));


app.use(express.static("public"));

app.set("view engine","ejs");


mongoose.connect("mongodb://localhost:27017/userDB",{UseNewUrlParser:true});

const userSchema=new mongoose.Schema({     //for authentication schema
    email:String,
    password:String
});


userSchema.plugin(encrypt,{secret:process.env.MYSECRET,encryptedFields:["password"]});   //userSchema + encryption plugin + only encryptedField is password
//MYSECRET is in .env file which is handled by require('dotenv').config()
const User=mongoose.model("User",userSchema); //modelName : Single form not plural form, and first letter : Capital;


  
app.get("/",function(req,res){
    res.render("home");
});


app.get("/registerKaro",function(req,res){
    res.render("register")
});

app.get("/loginKaro",function(req,res){
    res.render("login")
});



app.post("/registerKaro",function(req,res){
    const newUser=new User({
        email:req.body.username,   //register.ejs er name=username
        password:req.body.password
    });
    newUser.save(function(err){     //here encryption will be enabled with password field automatically.
        if(!err){
            res.render("secrets");   //rendering secrets.ejs from app.post("/registerkaro")
        }
        else{
            console.log(err);
        }
    });

});

app.post("/loginKaro",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username},function(err,foundUser){  //user exists or not  //here encryption will be disabled with password field automatically.
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                if(foundUser.password===password){       //password matches or not
                    res.render("secrets");
                    //res.send(foundUser.password);      //as password is decrypted here,so password is visible.
                }
                else{
                    res.send("Invalid Credentials.");
                }
            }
        }
    })
});

app.listen(3000,function(){
    console.log("Started.");
  });

