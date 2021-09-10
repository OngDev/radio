import VideoModel from '../models/video.model.js';
import UserModel from '../models/user.model.js';
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
        if (playingVideo && (playedTime > playingVideo.duration) && videoQueue.size() === 0) {
            playingVideo = null;
        }
        if ((playingVideo === null || (playedTime > playingVideo.duration)) && videoQueue.size() > 0) {
            console.log('Dequeue video to playing video')
            playingVideo = videoQueue.dequeue();
            currentVideoStartedTime = moment();
            io.emit('playingVideo', {
                playingVideo,
                playedTime: 0
            });
        }
        if (videoQueue.size() === 0) {
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
        const user = await UserModel.findOne({ email: authorEmail });

        const newVideo = await VideoModel.create({ title, youtubeVideoId, user, authorEmail, duration, thumbnailUrl });
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

export async function toggleLike(authorEmail, videoId) {
    try {
        const video = await VideoModel.findById(videoId);
        const user = await UserModel.findOne({ email: authorEmail });
        const userId = user._id.toString();
        const existedLike = video.likes.find((item) => item === userId);
        if (existedLike) {
            video.likes = video.likes.filter((item) => item !== userId);
        } else {
            video.dislikes = video.dislikes.filter((item) => item !== userId);
            video.likes.push(userId)
        }
        const savedVideo = await video.save();
        if (videoId === playingVideo._id.toString()) {
            io.emit('video-queue-item-update', {
                id: savedVideo._id.toString(),
                likes: savedVideo.likes,
                dislikes: savedVideo.dislikes
            });
            return savedVideo;
        }
        const queueItems = videoQueue.items().map((item) => {
            if (item._id.toString() === savedVideo._id.toString()) {
                item.likes = savedVideo.likes;
                item.dislikes = savedVideo.dislikes
                io.emit('video-queue-item-update', {
                    id: item._id.toString(),
                    likes: item.likes,
                    dislikes: item.dislikes
                });
            }
            return item;
        });

        videoQueue.setItems(queueItems);
        return savedVideo;
    } catch (error) {
        console.log(error.message);
    }
}

export async function toggleDislike(authorEmail, videoId) {
    try {
        const video = await VideoModel.findById(videoId);
        const user = await UserModel.findOne({ email: authorEmail });
        const userId = user._id.toString();
        const existedDislike = video.dislikes.find((item) => item === userId);
        if (existedDislike) {
            video.dislikes = video.dislikes.filter((item) => item !== userId);
        } else {
            video.likes = video.likes.filter((item) => item !== userId);
            video.dislikes.push(userId)
        }
        const savedVideo = await video.save();
        if (videoId === playingVideo._id.toString()) {
            io.emit('video-queue-item-update', {
                id: savedVideo._id.toString(),
                likes: savedVideo.likes,
                dislikes: savedVideo.dislikes
            });
            return savedVideo;
        }
        const queueItems = videoQueue.items().map((item) => {
            if (item._id.toString() === savedVideo._id.toString()) {
                item.likes = savedVideo.likes;
                item.dislikes = savedVideo.dislikes
                io.emit('video-queue-item-update', {
                    id: item._id.toString(),
                    likes: item.likes,
                    dislikes: item.dislikes
                });
            }
            return item;
        });

        videoQueue.setItems(queueItems);
        return savedVideo;
    } catch (error) {
        console.log(error.message);
    }
}