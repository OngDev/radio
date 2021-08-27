const { Types } = require('mongoose');
const Like = require('../models/like.model');

async function like(userId, videoId) {
	try {
		const isExist = await Like.findOne({ userId, videoId });
		if (isExist) return;
		return await Like.create({ _id: Types.ObjectId(), userId, videoId });
	} catch (error) {
		throw error;
	}
}

async function unLike(userId, videoId) {
	const like = await Like.findOne({ userId, videoId });
	if (!like) return;
	return Like.deleteOne({ videoId, userId });
}

async function countLike(videoId) {
	try {
		return await Like.count({ videoId });
	} catch (error) {
		throw error;
	}
}

module.exports = {
	like,
	unLike,
	countLike,
};
