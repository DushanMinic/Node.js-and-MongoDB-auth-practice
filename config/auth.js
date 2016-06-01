// Expose config directly to application using module.exports

module.exports = {
	'facebookAuth': {
		'clientID': '916912138421385', // App ID
		'clientSecret': 'ebb25235a07362e5365b7fcc8248d8f6', // App Secret
		'callbackURL': 'http://localhost:8080/auth/facebook/callback'
	},
	'twitterAuth': {
		'consumerKey': '',
		'consumerSecret': '',
		'callbackURL': 'http://localhost:8080/auth/twitter/callback'
	},
	'googleAuth': {
		'clientID': '',
		'clientSecret': '',
		'callbackURL': 'http://localhost:8080/auth/google/callback'
	}
};