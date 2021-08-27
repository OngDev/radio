const router = require('express').Router();
const { checkJwt } = require('../middlewares/auth.middleware');

module.exports = () => {
	router.get('/', (req, res, next) => {});
	return router;
};
