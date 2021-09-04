import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const videoSchema = new Schema({
    title: { type: String, required: true },
    authorEmail: { type: String, required: true, },
    youtubeVideoId: { type: String, required: true, unique: true },
    views: { type: Number, required: true, default: 0, min: 0 },
    duration: { type: Number, required: true },
    thumbnailUrl: { type: String, required: true },
}, { timestamps: true, versionKey: false });

const Video = model('Videos', videoSchema);

videoSchema.virtual('dislikes', {
    ref: 'Dislikes',
    localField: '_id',
    foreignField: 'videoId',
})

videoSchema.virtual('likes', {
    ref: 'Likes',
    localField: '_id',
    foreignField: 'videoId',
})

export default Video;