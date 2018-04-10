var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');
var log = require('logat');

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({ email: username })
			.populate('wallets')
			.populate('orders')
			.exec(function(err, user) {
				if (err) { return done(err); }
				if (!user) {
					return done(null, false, { message: __('Incorrect e-mail or password') });
				}
				if (!user.checkPassword(password)) {
					return done(null, false, { message: __('Incorrect e-mail or password') });
				}
				return done(null, user);
			});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

module.exports = {

	isLogged: function (req, res, next) {
		req.session.prevUrl = req.url;
		if (req.session.passport) {
			User.findById(req.session.passport.user._id)
				.populate('wallets orders ')
				.exec(function(err,user) {
					if(err) log.error(err)
					if (user) {
						req.currentUser = user;
						next();
					} else {
						res.redirect('/login');
					}
				});
		} else {
			res.redirect('/login');
		}
	},

	isAdmin: function (req, res, next) {
		req.session.prevUrl = req.url;
		if (req.session.passport) {
			User.findById(req.session.passport.user._id)
				.populate('wallets')
				.populate('orders')
				.exec(function(err,user) {
					if (user && (user.email == 'abrikoz@gmail.com' || user.email == 'me@abrikos.pro')) {
						req.currentUser = user;
						next();
					} else {
						var err = new Error('Forbidden');
						err.status = 403;
						return next(err,null)
					}
				});
		} else {
			var err = new Error('Forbidden');
			err.status = 403;
			return next(err,null)
		}
	},

	PassAuth: passport.authenticate('local', {
		successRedirect: '/cabinet',
		failureRedirect: '/login',
		failureFlash: true
	})

};

