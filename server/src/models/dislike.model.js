const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const dislikeSchema = new Schema(
	{
		_id: ObjectId,
		userId: { type: ObjectId, ref: 'User' },
		videoId: { type: ObjectId, ref: 'Video' },
	},
	{ timestamps: true, versionKey: false }
);

const Dislike = mongoose.model('Dislikes', dislikeSchema);
module.exports = Dislike;
