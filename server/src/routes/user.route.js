const router = require('express').Router();
const { checkJwt } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

module.exports = () => {
	router.get('/me', userController.userProfile);
	router.post('/', userController.createUser);
	return router;
};
