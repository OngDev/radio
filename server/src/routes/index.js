const router = require('express').Router();

module.exports = () => {
	router.get('/', function (req, res, next) {
		res.render('index', { title: 'Auth0 Webapp sample Nodejs' });
	});
	return router;
};
