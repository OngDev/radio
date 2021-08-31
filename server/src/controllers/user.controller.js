const userService = require('../services/user.service');

async function createUser(req, res, next) {
	try {
		const user = req.user;
		await userService.createUser(user);
		return res.json({ message: 'OK' });
	} catch (error) {
		next(error);
	}
}

async function userProfile(req, res, next) {
	try {
		const user = req.user;
		return res.json({ user });
	} catch (error) {
		next(error);
	}
}

module.exports = {
	createUser,
	userProfile,
};
