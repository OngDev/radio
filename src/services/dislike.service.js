const { Types } = require('mongoose');
const DisLike = require('../models/dislike.model');

async function dislike(authorEmail, videoId) {
    try {
        const isExist = await DisLike.findOne({ authorEmail, videoId });
        if (isExist) return;
        return await DisLike.create({ _id: Types.ObjectId(), authorEmail, videoId });
    } catch (error) {
        throw error;
    }
}

async function unDislike(authorEmail, videoId) {
    const like = await DisLike.findOne({ authorEmail, videoId });
    if (!like) return;
    return DisLike.deleteOne({ videoId, authorEmail });
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