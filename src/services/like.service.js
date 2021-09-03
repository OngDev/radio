const { Types } = require('mongoose');
const Like = require('../models/like.model');

async function like(authorEmail, videoId) {
    try {
        const isExist = await Like.findOne({ authorEmail, videoId });
        if (isExist) return;
        return await Like.create({ _id: Types.ObjectId(), authorEmail, videoId });
    } catch (error) {
        throw error;
    }
}

async function unLike(authorEmail, videoId) {
    const like = await Like.findOne({ authorEmail, videoId });
    if (!like) return;
    return Like.deleteOne({ videoId, authorEmail });
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