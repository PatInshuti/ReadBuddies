var express = require("express");
var app =  express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");
//mongoose.connect("mongodb://localhost:/Restful_Blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use (bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
/*var blogSchema = new mongoose.Schema({
  title:String,
  image:String,
  body:String,
  created:{type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);*/

//Blog.create({
//  title:" Adelle ",
//  image:"http://www.radio92fm.com.br/wp-content/uploads/2017/05/Adelle.jpg",
//  body: "This is a very good picture"
//})

//Restful routes
//INDEX
app.get("/", function(req, res){
  res.render("index");
});
/*app.get("/blogs", function(req,res){
  Blog.find({}, function(err,blogs){
    if (err){
      console.log("Somethig was wrong");
    }
    else{
      res.render("index", {blogs:blogs});
    }
  })

});
//New
app.get("/blogs/new", function(req, res){
  res.render("new");
});


//Create route , after it directs to another page
req.body.blog.body = req.sanitize(req.body.blog.body);
app.post("/blogs", function(req,res){
  //create blogs
  Blog.create(req.body.blog, function(err, NewBlog){
    if(err){
      console.log("Opps Eroor ocured");
    }

    else{
      res.redirect("/");
      console.log(req.body.blog);
    }

  });
});

//show routes
app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, FoundBlog){
    if (err){
      console.log("Error Occured");
    }
    else{
      res.render("show", {FoundBlog:FoundBlog});
    }
  });
});
// Edit routes

app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id,function(err,FoundBlog){
      if (err){
        console.log("Error occured in looking for the Blog to Edit");
      }

    else{
        res.render("edit",{FoundBlog:FoundBlog});
    }
  })

});

// Update route
req.body.blog.body = req.sanitize(req.body.blog.body);
app.put("/blogs/:id",function(req, res){
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, UpdatedBlog){
    if(err){
      console.log("Something went wrong");
    }
    else{
      res.redirect("/blogs/"+req.params.id);
    }
  })
});

//Delete Routes
app.delete("/blogs/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err, deletedBlog){
    if (err){
      console.log("Delete Failed");
    }
    else{
      res.redirect("/");
    }
  })
})*/

var port=4000;
app.listen(port, function(){
  console.log("server running at"+ port);
});
