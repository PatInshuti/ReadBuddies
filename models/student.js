const Subject = require('../models/subjects.js');
const mongoose = require('mongoose'), Schema = mongoose.Schema;

const StudentSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
	age: { type: Number, required: true },
	subjects : [{ type: Schema.Types.ObjectId, ref: 'Subject' }]
});

module.exports = mongoose.model('Student', StudentSchema);