const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema(
	{
		_id: ObjectId,
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true },
		isActive: { type: Boolean, default: false },
	},
	{ timestamps: true, versionKey: false },
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
