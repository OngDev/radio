const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const bcrypt = require('bcrypt');
const { get } = require('../config/index');

const UserSchema = new Schema(
	{
		_id: ObjectId,
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true },
		password: { type: String, required: true, min: 4 },
		roles: {
			type: String,
			apply: ['User', 'Admin'],
			default: 'User',
			required: true,
		},
		isActive: { type: Boolean, default: false },
	},
	{ timestamps: true, versionKey: false },
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

UserSchema.pre('save', async function (next) {
	const user = this;
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, get('SALT'));
	}
	next();
});

UserSchema.pre('remove', async function (next) {
	const user = this;
	user.model('Data').deleteMany({ user: this._id });
	next();
});

UserSchema.methods.comparePassword = async function comparePassword(password) {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
