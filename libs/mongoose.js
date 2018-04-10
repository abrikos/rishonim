/**
 * Created by abrikos on 06.03.17.
 */
var mongoose = require('mongoose');
var log   = require('logat');

//var options = { promiseLibrary: require('q') };
//var db = mongoose.createConnection(config.mongoose.uri, options);
mongoose.Promise = global.Promise;


mongoose.connect('mongodb://127.0.0.1:27017/idear',{  useMongoClient: true  }); //set FALSE in production
var db = mongoose.connection;

db.on('error', function (err) {
	log.error('connection error:', err.message);
});
db.once('open', function callback () {
	log.info("Connected to DB!");
});

module.exports = mongoose;
