var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logSchema = new Schema({
	email: 	{ type: String, required: true },
	irc: 	{ type: Array, default: [] },
	system: { type: Array, default: [] }

});

module.exports = mongoose.model('logs', logSchema);

console.log("Model '" + require('path').basename(module.id) + "' loaded.");