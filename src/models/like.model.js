const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const likeSchema = new Schema({
    _id: ObjectId,
    authorEmail: { type: String, required: true },
    videoId: { type: ObjectId, ref: 'Video' },
}, { timestamps: true, versionKey: false });

const Like = mongoose.model('Likes', likeSchema);
module.exports = Like;