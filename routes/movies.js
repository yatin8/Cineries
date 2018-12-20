var express = require("express");
var router  = express.Router();
var Movie = require("../models/movie");
var middleware = require("../middleware/middleware");
var request = require("request");


router.get("/", function(req, res){
    Movie.find({}, function(err, movies){
        if(err){
            console.log(err);
        } else {
            request('https://maps.googleapis.com/maps/api/geocode/json?address=sardine%20lake%20ca&key=AIzaSyBtHyZ049G_pjzIXDKsJJB5zMohfN67llM', function(error,response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body); 
                    res.render("movies/movies",{movie:movies});
                }
            });
        }
    });
});


router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newMovie = {name: name, image: image, description: desc, author:author}
    Movie.create(newMovie, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/movies");
        }
    });
});


router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("movies/new"); 
});


router.get("/:id", function(req, res){
    Movie.findById(req.params.id).populate("comments").exec(function(err, foundMovie){
        if(err){
            console.log(err);
        } else {
            console.log(foundMovie)
            res.render("movies/show", {movie: foundMovie});
        }
    });
});


router.get("/:id/edit", middleware.checkUserMovie, function(req, res){
    console.log("IN EDIT!");
    Movie.findById(req.params.id, function(err, foundMovie){
        if(err){
            console.log(err);
        } else {
            res.render("movies/edit", {movie: foundMovie});
        }
    });
});


router.put("/:id", function(req, res){
    var newData = {name: req.body.name, image: req.body.image, description: req.body.desc};
    Movie.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, movie){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/movies/" + movie._id);
        }
    });
});

router.delete("/:id",middleware.checkUserMovie, function(req, res){
   Movie.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/movies");
      } else {
          res.redirect("/movies");
      }
   });
});

module.exports = router;