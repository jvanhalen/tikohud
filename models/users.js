var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roles = ['guest', 'student', 'teacher', 'admin'];

	var nick = { 
		primary: 	{type: String, default: 'User'+Rnd()},
		secondary: 	{type: String, default: 'User'+Rnd()},
		tertiary: 	{type: String, default: 'User'+Rnd()}
	}

	var server = {
		address: 	{type: String, default: 'irc.quakenet.org'},
		port: 		{type: String, default: '6667'},
		channels: 	['#kareliatiko2', '#pkamktiko2']
	}

var userSchema = new Schema({
	firstname: 	{ type: String, required: true },
	lastname: 	{ type: String, required: true },
	password: 	{ type: String, required: true },
	email: 		{ type: String, required: true },
	role: 		{ type: String, enum: roles, default: 'guest'},
	irc: 		{ nick: nick, server: server, log: String}
});

function Rnd() {
	return Math.floor(Math.random() * 10000) + 1;
}

module.exports = mongoose.model('users', userSchema);

console.log("Model '" + require('path').basename(module.id) + "' loaded.");