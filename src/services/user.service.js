const { Types } = require('mongoose');
const User = require('../models/user.model');

async function createUser(data) {
	try {
		return await User.create({ _id: Types.ObjectId(), ...data });
	} catch (error) {
		throw error;
	}
}

module.exports = {
	createUser,
};
