const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const videoSchema = new Schema({
    _id: ObjectId,
    title: { type: String, required: true, unique: true },
    authorEmail: { type: String, required: true, },
    order: { type: Number, required: false },
    youtubeVideoId: { type: String, required: true, unique: true },
    views: { type: Number, required: true, default: 0, min: 0 },
}, { timestamps: true, versionKey: false });

const Video = mongoose.model('Videos', videoSchema);
module.exports = Video;