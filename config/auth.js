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
		'clientID': '370056413957-lurvngb0vnap6khf2i0c5ikb1f6fkce4.apps.googleusercontent.com',
		'clientSecret': 'wpjR10EK_ZmXRtFMFlmQqK45',
		'callbackURL': 'http://127.0.0.1:8080/auth/google/callback'
	}
};