const router = require('express').Router();
const { checkJwt } = require('../middlewares/auth.middleware');

module.exports = () => {
	router.get();
	return router;
};
