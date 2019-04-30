var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    cookieParser   = require("cookie-parser"),
    LocalStrategy  = require("passport-local"),
    flash          = require("connect-flash"),
    Movie          = require("./models/movie"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    session        = require("express-session"),
    methodOverride = require("method-override"),
    commentRoutes  = require("./routes/comments"),
    movieRoutes    = require("./routes/movies"),
    loginAndSignupRoutes    = require("./routes/loginAndSignup");


console.log(process.env.DATABASEURL);
var url = process.env.DATABASEURL || "mongodb://localhost/cineries" ;
mongoose.connect(url);
    

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));


app.use(require("express-session")({
    secret: "Movies Review Web App",
    resave: false,
    saveUninitialized: false
}));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


app.use("/", loginAndSignupRoutes);
app.use("/movies", movieRoutes);
app.use("/movies/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Cineries Server Has Started!");
});
