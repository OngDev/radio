import mongoose from 'mongoose';
const { Schema, model } = mongoose
const ObjectId = Schema.Types.ObjectId;

const dislikeSchema = new Schema({
    authorEmail: { type: String, required: true, },
    videoId: { type: ObjectId, ref: 'Video' },
}, { timestamps: true, versionKey: false });

const Dislike = model('Dislikes', dislikeSchema);
export default Dislike;