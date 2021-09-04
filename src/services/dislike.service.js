// import mongoose from 'mongoose';
// const { Schema: { Types } } = mongoose;
import DislikeModel from '../models/dislike.model.js';

export async function dislike(authorEmail, videoId) {
    try {
        const isExist = await DislikeModel.findOne({ authorEmail, videoId });
        if (isExist) throw 'Disliked';
        return await DislikeModel.create({ authorEmail, videoId });
    } catch (error) {
        throw error;
    }
}

export async function unDislike(authorEmail, videoId) {
    const like = await DislikeModel.findOne({ authorEmail, videoId });
    if (!like) throw 'Undisliked';
    return DislikeModel.deleteOne({ videoId, authorEmail });
}

export async function countDislike(videoId) {
    try {
        return await DislikeModel.find({ videoId });
    } catch (error) {
        throw error;
    }
}