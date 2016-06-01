// Expose config directly to application using module.exports

module.exports = {
	'facebookAuth': {
		'clientID': '916912138421385', // App ID
		'clientSecret': 'ebb25235a07362e5365b7fcc8248d8f6', // App Secret
		'callbackURL': 'http://localhost:8080/auth/facebook/callback'
	},
	'twitterAuth': {
		'consumerKey': 'hVPetnU2Pvh1tvZO3OTbi5pIY',
		'consumerSecret': '2mWQl5F3JkrHISNaI8v1itguAO7LXmQ2qdET1tfRwnhwYCQbyB',
		'callbackURL': 'http://127.0.0.1:8080/auth/twitter/callback'
	},
	'googleAuth': {
		'clientID': '690293453082-pud815v8fmlu2lh2m4ptqthaqpcfv106.apps.googleusercontent.com',
		'clientSecret': '06uo29iu8hVUr0A4UrZ5j6_E',
		'callbackURL': 'http://127.0.0.1:8080/auth/google/callback'
	}
};