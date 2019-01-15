var express               = require("express"),
    app                   = express(),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    Category              = require("./models/category"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")

var Schema = mongoose.Schema;
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



const personSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

const storySchema = mongoose.Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Person' },
  title: String,
  fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
});

const Story = mongoose.model('Story', storySchema);
const Person = mongoose.model('Person', personSchema);

const author = new Person({
  _id: new mongoose.Types.ObjectId(),
  name: 'Ian Fleming',
  age: 50
});

//console.log("here");
author.save(function (err) {
  if (err) return handleError(err);

  const story1 = new Story({
    title: 'Casino Royale',
    author: author._id    // assign the _id from the person
  });

  story1.save(function (err) {
    if (err) return handleError(err);
    // thats it!
  });
});

Story.
  findOne({ title: 'Casino Royale' }).
  populate('author').
  exec(function (err, story) {
    if (err) return handleError(err);
    console.log('The author is %s', story.author.name);
    // prints "The author is Ian Fleming"
  });

var port=4000;
app.listen(port, function(req, res){
  console.log("server running at"+ port);
});
