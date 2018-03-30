var express               = require("express"),
    app                   = express(),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")

mongoose.connect("mongodb://localhost/sb8");

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});
//============
// ROUTES
//============

app.get("/", function(req, res){
    res.render("index");
});

app.get("/secret",isLoggedIn, function(req, res){
   res.render("secret");
});

app.get("/fail", function(req, res){
  res.render("fail");
})



//  ===========
// AUTH ROUTES
//  ===========

// show register form
app.get("/register", function(req, res){
   res.render("register");
});
//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({email:req.body.email, username: req.body.username,tutor:false});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.send("Sucesss Registration");
           console.log("Username"+username);
           console.log("Email"+email);
        });
    });
});

app.get("/registerTutor", function(req, res){
   res.render("registerTutor");
});
app.post("/registerTutor", function(req, res){
  var newUser = new User({email:req.body.email, username: req.body.username,tutor:true});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.send("Tutor Registration Sucesss");
        });
    });
});



// show login form
app.get("/login", function(req, res){
   res.render("login");
});
// handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/secret",
        failureRedirect: "/fail"
    }), function(req, res){
});

// logic route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
var port=3000;
app.listen(port, function(req, res){
  console.log("server running at"+ port);
});
