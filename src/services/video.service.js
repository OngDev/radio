const axios = require('axios');
const { get } = require('../configs/env.config');
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

async function createVideo(video, user) {
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

async function searchYoutube(keyword) {
    try {
        const youtubeUrl = get('youtube_api_url')
        console.log(youtubeUrl)
        const response = await axios.get(`${youtubeUrl}&q=${keyword}`);
        return response.data
    } catch (error) {
        console.error(error.response.data)
        throw error;
    }
}

module.exports = {
    getVideoById,
    getAll,
    createVideo,
    deleteVideo,
    searchYoutube
};