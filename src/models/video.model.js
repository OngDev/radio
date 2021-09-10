import mongoose from 'mongoose';
import User from './user.model.js';
const { Schema, model } = mongoose;
const ObjectId = Schema.Types.ObjectId;
const videoSchema = new Schema({
    title: { type: String, required: true },
    user: { type: ObjectId, ref: User },
    authorEmail: { type: String, required: true, },
    youtubeVideoId: { type: String, required: true, unique: true },
    views: { type: Number, required: true, default: 0, min: 0 },
    duration: { type: Number, required: true },
    thumbnailUrl: { type: String, required: true },
    likes: [],
    dislikes: [],
}, { timestamps: true, versionKey: false });

const Video = model('Videos', videoSchema);

export default Video;