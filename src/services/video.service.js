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

async function initPlaylist() {
    const videos = await Video.find().populate('likes').populate('dislikes');
    console.log(videos);
    const sortedVideos = videos.sort((a, b) => {

    });
    console.log(sortedVideos);
    for (let i = 0; i < sortedVideos.length; i++) {
        await Video.findByIdAndUpdate(sortedVideos[i].id, {
            order: i
        });
    }
    console.log('Finished initiating playlist');
}

module.exports = {
    getVideoById,
    getAll,
    createVideo,
    deleteVideo,
    searchYoutube,
    initPlaylist
};