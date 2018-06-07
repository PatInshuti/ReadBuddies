var express               = require("express"),
    app                   = express(),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    Category              = require("./models/category"),
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
  res.redirect("/categories")
})
app.get("/categories", function(req, res){
  Category.find({},function(err,FoundCategory){
    if(err){
      console.log("Error happening in finding The Category");
    }

    res.render("index", {Category:FoundCategory});

  });
});

app.get("/categories/:id", function(req, res){
  Category.findById(req.params.id, function(err, FoundCategory){
    if (err){
      console.log("Error Occured");
    }
      User.find({tutor: true},function(err, FoundTutor){
        if(err){
          console.log("Error Found in Finding Tutor in a specific category");
        }
        else{
          res.render("categoryTutors", {FoundTutor:FoundTutor});
        }
      })
  });
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
          res.render("completeStudentRegistration");
        });
    });
});

app.get("/registerTutor", function(req, res){
   res.render("registerTutor");
});
app.post("/registerTutor", function(req, res){
  var newUser = new User({email:req.body.email, username: req.body.username, tutor:true});
      Category.create({
        name:"Bio",
        content:" key to understanding sciences"
      }, function(err, Category){
        if(err){
          console.log("Can't Create Category");
        }

        newUser.category.push(Category);
        newUser.save();

      });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log("Error in creating tutor");
            return res.render("/");
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

//Category.create({

//  name:"Math",
//  content:"key to understanding sciences"
//});


var port=3000;
app.listen(port, function(req, res){
  console.log("server running at"+ port);
});
