const router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const userController = require('../controllers/user.controller');

module.exports = () => {
    router.get('/me', requiresAuth(), userController.userProfile);
    router.post('/', requiresAuth(), userController.createUser);
    return router;
};