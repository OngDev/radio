import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const ObjectId = Schema.Types.ObjectId;
const videoSchema = new Schema({
    title: { type: String, required: true },
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