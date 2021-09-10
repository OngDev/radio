import mongoose from 'mongoose';
const { Schema, model } = mongoose;;
const userSchema = new Schema({
    email: { type: String, required: true },
    nickname: { type: String, required: true },
    picture: { type: String, required: true }
}, { timestamps: true, versionKey: false });

const User = model('Users', userSchema);

export default User;