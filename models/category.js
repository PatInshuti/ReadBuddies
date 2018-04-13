var mongoose = require("mongoose");

var CategorySchema = new mongoose.Schema({
  name:String,
  content: String
});

module.exports = mongoose.model("Category", CategorySchema);
