const PORT = process.env.PORT || 8080;
// CORS kiesrtää tietoturvarajoitukset (ensin asenna 'npm install cors --save')
var cors = require('cors')
// Env-tiedoston luonti db salasanan ja käyttäjätunnuksen salaamiseksi (ensin asenna 'npm install dotenv --save')
require('dotenv').config();
// Serveri luodaan Express kehystä käyttäen (Ensin asenna 'npm install express --save')
var express = require("express");
// Dataa voidaan hakea verkosta Axios-kirjastoa käyttäen (Ensin asenna 'npm install axios --save')
var axios = require("axios");
// Mongodb tietokannan tuonti (Ensin asenna 'npm install mongodb --save')
const MongoClient = require("mongodb").MongoClient;
// Mongoose kehyksen tuonti (Ensin asenna 'npm install mongoose --save)
var mongoose = require("mongoose")
// File system reader
var fs = require("fs");
var app = express();
app.use(cors())
// Otetaan EJS käyttöön (Ensin asenna 'npm install ejs --save')
app.set("view engine", "ejs");
// Tuodaan bodyParser käyttöön jotta voidaan lukea lomakedataa
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// Luetaan staattisia tiedostoja public direktorista
app.use(express.static("./public"));

// Tällä pakotetaan sivupohja tuottamaan sisennettyä, kaunista HTML:ää.
// Tuotantokäytössä asetus voi olla false jolloin sivujen koko pienenee hieman
app.locals.pretty = true;

// Script tietokantaan
const uri = process.env.CONNECTIONSTRING 

// Yhdistetään tietokantaan
mongoose.connect(uri, {useNewUrlParser:true, useUnifiedTopology:true});

const Restaurant = mongoose.model("Restaurant", {
  address: {
    street: String,
    zipcode: Number,
  },
  borough: String,
  cuisine: String,
  name: String
}, 'restaurants');

// Tulostetaan tietokannan kaikki oliot
// app.get("/api/getall", function(req, res) {
//     Restaurant.find({}, null, {limit:20}, function(err, results) {
//         //if err then return the fault code to browser
//     if(err) {
//         res.status(500).json("Fault in data search");
//       } else {
//         // Return the results as JSON-objects to browser
//         res.status(200).json(results);      
//       };  
//     });
// });

// Mahdollistaa tietokannasta parametreillä nimi, asuinalue, ruokalaji
app.get("/api/getall", function(req, res) {
  var borough = req.query.borough
  var cuisine = req.query.cuisine
  var filter = {}
  if (borough != null) filter.borough = borough
  if (cuisine != null) filter.cuisine = cuisine

  Restaurant.find(filter, null, {limit:150}, function(err, results) {
      //if err then return the fault code to browser
  if(err) {
      res.status(500).json("Fault in data search");
    } else {
      // Return the results as JSON-objects to browser
      res.status(200).json(results);      
    };  
  });
});

// Hakee APIsta kaikki ruokalajit
app.get("/api/cuisines", function(req, res) {
  Restaurant.find({}, null, function(err, results) {
      //if err then return the fault code to browser
  if(err) {
      res.status(500).json("Fault in data search");
    } else {
      // Return the results as JSON-objects to browser
      var cuisines = [];
      for (var i = 0; i < results.length; i++){
        if (cuisines.includes(results[i].cuisine)){
          continue;
        }
        cuisines.push(results[i].cuisine)
      }
      res.status(200).json(cuisines);      
    };  
  });
});

// Hakee APIsta kaikki asuinalueet
app.get("/api/boroughs", function(req, res) {
  Restaurant.find({}, null, function(err, results) {
      //if err then return the fault code to browser
  if(err) {
      res.status(500).json("Fault in data search");
    } else {
      // Return the results as JSON-objects to browser
      var boroughs = [];
      for (var i = 0; i < results.length; i++){
        if (boroughs.includes(results[i].borough)){
          continue;
        }
        boroughs.push(results[i].borough)
      }
      res.status(200).json(boroughs);      
    };  
  });
});

// Haetaan tietokannan olio ID:n perusteella
app.get("/api/:id", function(req, res) {
  var id = req.params.id;
  Restaurant.findById(id, function(err, results) {
      //if err then return the fault code to browser
  if(err) {
      res.status(500).json("Fault in data search");
    } else {
      // Return the results as JSON-objects to browser
      res.status(200).json(results);
    };  
  });
});

// Lisätään tietokantan uusi olio
app.post("/api/add", function(req, res) {
    var newRestaurant = new Restaurant ({
      address: {
        street: req.body.address.street
      },
      borough: req.body.borough,
      cuisine: req.body.cuisine,
      name: req.body.name
    })

    newRestaurant
        .save()
    res.send(newRestaurant)
})

// Muokataan tietokannassa olevaa oliota antamalla ID
app.put("/api/update/:id", function(req, res) {
    var id = req.params.id;
    var newdata = { 
      address: {
      street: req.body.address.street
      },
      borough: req.body.borough,
      cuisine: req.body.cuisine,
      name: req.body.name 
  }
    var options = { new: true }
    Restaurant.findByIdAndUpdate(
        id,
        newdata,
        options,
        function(err, result) {
            res.send(result);
        }
    )
  });

  // Poistetaan tietokannan olio ID:n perusteella
  app.delete("/api/delete/:id", function(req, res) {
    // Take the id for the delete operation
    var id = req.params.id;
  
    Restaurant.findByIdAndDelete(id, function (err, results) {
        // Database error handling 
        if (err) {
         console.log(err);
         res.status(500).json("Fault in delete operation.");
      } // Tietokanta ok, but object cannot be found
        else if (results == null) {
         res.status(200).json("Cannot be deleted as object cannot be found.");
      } // Successful delete operation
        else {
        console.log(results);
        res.status(200).json("Deleted " + id);
      }
    });
  });
  


// NOT FOUND SIVU

app.get("*", function (req, res) {
    res.status(404).send("Cannot find the requested page");
});

app.listen(PORT);