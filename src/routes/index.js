const router = require('express').Router();

module.exports = () => {
	router.get('/', function (req, res, next) {
		res.json('Hello World!');
	});
	return router;
};
