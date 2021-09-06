import VideoModel from '../models/video.model.js';
import { getYoutubeVideo } from './youtube.service.js';
import Queue from '../utils/queue.util.js';
import moment from 'moment';
const videoQueue = new Queue();
let playingVideo = null;
let currentVideoStartedTime = null;
import io from '../../index.js';

setInterval(() => {
    try {
        const playedTime = moment().diff(currentVideoStartedTime, 'seconds');
        if ((playingVideo === null || (playedTime > playingVideo.duration)) && videoQueue.size() > 0) {
            console.log('Dequeue video to playing video')
            playingVideo = videoQueue.dequeue();
            currentVideoStartedTime = moment();
            io.emit('playingVideo', {
                playingVideo,
                playedTime: 0
            });
        }
        if (videoQueue.size() === 0 && playingVideo === null) {
            console.log('Playlist is empty, init new')
            initPlaylist();
        }
    } catch (error) {
        console.log(error.message)
    }

}, 2000)

export async function getVideoById(id) {
    try {
        return await VideoModel.findById(id);
    } catch (error) {
        throw error;
    }
}

export async function getAll() {
    try {
        return videoQueue.items();
    } catch (error) {
        throw error;
    }
}

export async function createVideo(youtubeVideoId, authorEmail) {
    try {
        const { title, thumbnailUrl, duration } = await getYoutubeVideo(youtubeVideoId);

        const newVideo = await VideoModel.create({ title, youtubeVideoId, authorEmail, duration, thumbnailUrl });
        io.emit('new-video-added', {});
        videoQueue.enqueue(newVideo)
        return newVideo;
    } catch (error) {
        console.log(error.message)
        throw error;
    }
}

export async function deleteVideo(id) {
    try {
        videoQueue.deleteVideo(id);
        io.emit('new-video-added', {});
        return await VideoModel.findByIdAndDelete(id);
    } catch (error) {
        throw error;
    }
}

export async function initPlaylist() {
    const videos = await VideoModel.find().populate('likes').populate('dislikes');
    const sortedVideos = videos.sort((a, b) => {
        const firstElementInteractions = a.likes ? a.likes.length : 0 - a.dislikes ? a.dislikes.length : 0;
        const secondElementInteractions = b.likes ? b.likes.length : 0 - b.dislikes ? b.dislikes.length : 0;

        if (firstElementInteractions < secondElementInteractions) return -1;
        if (firstElementInteractions > secondElementInteractions) return 1;
        return 0;
    });

    for (const video of sortedVideos) {
        videoQueue.enqueue(video)
    }
    //TODO: Add algo

    return sortedVideos;

}

export function getPlayingVideo() {
    const playedTime = moment().diff(currentVideoStartedTime, 'seconds');
    return { playingVideo, playedTime }
}