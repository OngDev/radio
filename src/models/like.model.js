import mongoose from 'mongoose';
const { Schema, model } = mongoose
const ObjectId = Schema.Types.ObjectId;

const likeSchema = new Schema({
    authorEmail: { type: String, required: true },
    videoId: { type: ObjectId, ref: 'Video' },
}, { timestamps: true, versionKey: false });

const Like = model('Likes', likeSchema);
export default Like;