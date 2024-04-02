 var express = require("express");
 const cookieParser = require('cookie-parser')
 var app = express();
 var bodyParser = require("body-parser");
 app.use(cookieParser())
 app.set("view engine","ejs");
 app.set("views", "./views");
 app.use(express.static("public"));
 var fs = require("fs");
 app.listen(3000);
 app.use(bodyParser.urlencoded({ extended: false }))

 const {default: mongoose}= require("mongoose");
 fs.readFile("./config.json", "utf-8", (err, data)=>{
    if(err){
        console.log("read file error");
    }else{
        var objJson = JSON.parse(data);
        mongoose.connect(objJson.dbConnectionString)
        .then(()=>{
            console.log("Mongoose connect succesful!!");
            require("./routes/Homepage/main")(app, objJson, isEmailValid);
        })
        .catch((err)=>{
            console.log(err);
            console.log("Fails");
        })
    }
 })
// check email 

function isEmailValid(email) {
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (!email)
        return false;

    if(email.length>254)
        return false;

    var valid = emailRegex.test(email);
    if(!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if(parts[0].length>64)
        return false;

    var domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return false;

    return true;
}
 