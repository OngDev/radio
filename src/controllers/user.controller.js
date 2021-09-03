const userService = require('../services/user.service');

async function createUser(req, res, next) {
    try {
        const user = req.oidc.user;
        console.log(user);
        await userService.createUser(user);
        return res.json({ message: 'OK' });
    } catch (error) {
        next(error);
    }
}

async function userProfile(req, res, next) {
    try {
        const { nickname, picture } = req.oidc.user;
        return res.json({ nickname, picture });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createUser,
    userProfile,
};