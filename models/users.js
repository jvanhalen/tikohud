var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roles = ['guest', 'student', 'teacher', 'admin'];

var userSchema = new Schema({
	firstname: 	{ type: String, required: true },
	lastname: 	{ type: String, required: true },
	password: 	{ type: String, required: true },
	email: 		{ type: String, required: true },
	role: 		{ type: String, enum: roles, default: 'guest'},
	courses: 	[Schema.Types.ObjectId]
});

mongoose.model('users', userSchema);