var express = require("express");
var router  = express.Router({mergeParams: true});
var Movie = require("../models/movie");
var Comment = require("../models/comment");
var middleware = require("../middleware/middleware");


router.get("/new", middleware.isLoggedIn, function(req, res){
    console.log(req.params.id);
    Movie.findById(req.params.id, function(err, movie){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {movie: movie});
        }
    })
});


router.post("/",middleware.isLoggedIn,function(req, res){
    Movie.findById(req.params.id, function(err, movie){
        if(err){
            console.log(err);
            res.redirect("/movies");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    movie.comments.push(comment);
                    movie.save();
                    console.log(comment);
                    req.flash('success', 'Created a comment!');
                    res.redirect('/movies/' + movie._id);
                }
            });
        }
    });
});


router.get("/:commentId/edit", middleware.isLoggedIn, function(req, res){
    Comment.findById(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
            res.render("comments/edit", {movie_id: req.params.id, comment: comment});
        }
    })
});


router.put("/:commentId", function(req, res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
        if(err){
            res.render("edit");
        } else {
            res.redirect("/movies/" + req.params.id);
        }
    }); 
});


router.delete("/:commentId",middleware.checkUserComment, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err){
            console.log("PROBLEM!");
        } else {
            res.redirect("/movies/" + req.params.id);
        }
    })
});


module.exports = router;