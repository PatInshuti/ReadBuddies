var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  email:String,
  username: String,
  password: String,
  email:String,
  tutor:Boolean,
  category:[
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Category"
      }
   ]
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
