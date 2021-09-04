import mongoose from 'mongoose';
const { Schema: { Types } } = mongoose;
import LikeModel from '../models/like.model.js';

export async function like(authorEmail, videoId) {
    try {
        const isExist = await LikeModel.findOne({ authorEmail, videoId });
        if (isExist)  throw 'Liked';
        return await LikeModel.create({ authorEmail, videoId });
    } catch (error) {
        throw error;
    }
}

export async function unLike(authorEmail, videoId) {
    const like = await LikeModel.findOne({ authorEmail, videoId });
    if (!like) return;
    return LikeModel.deleteOne({ videoId, authorEmail });
}

export async function countLike(videoId) {
    try {
        return await LikeModel.count({ videoId });
    } catch (error) {
        throw error;
    }
}