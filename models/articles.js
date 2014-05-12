var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
	content: {type: String, required: true},
	user: {
		type: Schema.ObjectId,
		ref: 'users'
	}
});

mongoose.model('articles', articleSchema);