const { Types } = require('mongoose');
const Video = require('../models/video.model');

async function getVideoById(id) {
	try {
		return await Video.findById(id);
	} catch (error) {
		throw error;
	}
}

async function getAll() {
	try {
		return await Video.find();
	} catch (error) {
		throw error;
	}
}

async function createVideo(video) {
	try {
		return await Video.create({ _id: Types.ObjectId(), ...video });
	} catch (error) {
		throw error;
	}
}

async function deleteVideo(id) {
	try {
		return await Video.findByIdAndDelete(id);
	} catch (error) {
		throw error;
	}
}

module.exports = {
	getVideoById,
	getAll,
	createVideo,
	deleteVideo,
};
