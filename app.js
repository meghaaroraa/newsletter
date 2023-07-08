//jshint eversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    // res.send("hello");

    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
    // console.log("post request received");

    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    // console.log(firstName, lastName, email);

    var data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    };

    var JSONdata = JSON.stringify(data);

    var url = "https://us21.api.mailchimp.com/3.0/lists/82ce370d88";
    
    const options = {
        method : "POST",
        auth : "megha:" + process.env.KEY
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }

        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(JSONdata);
    request.end();
})

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(3000, function(){
    console.log("server started on port 3000");
})

// API Key
// 0c0cf224dd5e2e7c17a592974954ac3d-us21

// list Id
// 82ce370d88