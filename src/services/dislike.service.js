import mongoose from 'mongoose';
const { Schema: { Types } } = mongoose;
import DislikeModel from '../models/dislike.model.js';

export async function dislike(authorEmail, videoId) {
    try {
        const isExist = await DislikeModel.findOne({ authorEmail, videoId });
        if (isExist) return;
        return await DislikeModel.create({ _id: Types.ObjectId(), authorEmail, videoId });
    } catch (error) {
        throw error;
    }
}

export async function unDislike(authorEmail, videoId) {
    const like = await DislikeModel.findOne({ authorEmail, videoId });
    if (!like) return;
    return DislikeModel.deleteOne({ videoId, authorEmail });
}

export async function countDislike(videoId) {
    try {
        return await DislikeModel.count({ videoId });
    } catch (error) {
        throw error;
    }
}