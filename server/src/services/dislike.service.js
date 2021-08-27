const { Types } = require('mongoose');
const DisLike = require('../models/dislike.model');

async function dislike(userId, videoId) {
	try {
		const isExist = await DisLike.findOne({ userId, videoId });
		if (isExist) return;
		return await DisLike.create({ _id: Types.ObjectId(), userId, videoId });
	} catch (error) {
		throw error;
	}
}

async function unDislike(userId, videoId) {
	const like = await DisLike.findOne({ userId, videoId });
	if (!like) return;
	return DisLike.deleteOne({ videoId, userId });
}

async function countDislike(videoId) {
	try {
		return await DisLike.count({ videoId });
	} catch (error) {
		throw error;
	}
}

module.exports = {
	dislike,
	unDislike,
	countDislike,
};
