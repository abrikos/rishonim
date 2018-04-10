let mongoose = require('../libs/mongoose');

// define the schema for our user model
let schema = mongoose.Schema({
		date: { type: Date, default: Date.now },
		title:String,
		topic:String,
		body:String,
		order:Number,
		link:{type:String, index:true},
		visible:{ type: Boolean, default: true },
		page:{ type: mongoose.Schema.Types.ObjectId, ref: 'Page', required:true, index:true },
	}
);

schema.virtual('img')
	.get(function () {
		return '/upload/a-' + this.id + '.jpg'
	});

// create the model for users and expose it to our app
module.exports = mongoose.model('Article', schema);
