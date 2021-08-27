const { protectedAuth } = require('../middlewares/auth.middleware');
const router = require('express').Router();

module.exports = () => {
	router.get('/user', protectedAuth(), function (req, res, next) {
		const { _raw, _json, ...userProfile } = req.user;
		res.render('user', {
			userProfile: JSON.stringify(userProfile, null, 2),
			title: 'Profile page',
		});
	});
	return router;
};
