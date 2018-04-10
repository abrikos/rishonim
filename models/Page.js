let mongoose = require('../libs/mongoose');

// define the schema for our user model
let schema = mongoose.Schema({
		date: { type: Date, default: Date.now },
		title:String,
		topic:String,
		body:String,
		banner:String,
		link:{type:String, index:true},
		visible:{ type: Boolean, default: false },
		//articles:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Article', index:true },]
	},
	{
		toObject: {virtuals:true},
		// use if your results might be retrieved as JSON
		// see http://stackoverflow.com/q/13133911/488666
		//toJSON: {virtuals:true}
	}
);

schema.virtual('articles', {
	ref: 'Article', // The model to use
	localField: '_id', // Find people where localField
	foreignField: 'page' // is equal to foreignField
});

schema.virtual('img')
	.get(function () {
		return '/upload/p-' + this.id + '.jpg'
	});

// create the model for users and expose it to our app
module.exports = mongoose.model('Page', schema);
