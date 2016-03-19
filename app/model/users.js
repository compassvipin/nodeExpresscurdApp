var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/blogs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: Date,
  updated_at: Date
});


var User = mongoose.model('User', userSchema);

module.exports = User;