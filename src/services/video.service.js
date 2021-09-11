import VideoModel from '../models/video.model.js';
import UserModel from '../models/user.model.js';
import { getYoutubeVideo } from './youtube.service.js';
import Queue from '../utils/queue.util.js';
import moment from 'moment';
const videoQueue = new Queue();

let seniorSongs = [];
let juniorSongs = [];
let otherSongs = [];
let songsForQueue = [];
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

export function getAll() {
    try {
        return songsForQueue;
    } catch (error) {
        throw error;
    }
}

export function getSenior() {
    try {
        return seniorSongs;
    } catch (error) {
        throw error;
    }
}

export function getJunior() {
    try {
        return juniorSongs;
    } catch (error) {
        throw error;
    }
}

export function getOther() {
    try {
        return otherSongs;
    } catch (error) {
        throw error;
    }
}

export async function createVideo(youtubeVideoId, authorEmail) {
    try {
        const { title, thumbnailUrl, duration } = await getYoutubeVideo(youtubeVideoId);
        const user = await UserModel.findOne({ email: authorEmail });
        const newVideo = await VideoModel.create({ title, youtubeVideoId, user, duration, thumbnailUrl });
        otherSongs.push({...newVideo._doc,
            user: {
                _id: user._id,
                nickname: user.nickname
            }
        });
        io.emit('other-tracks-update', otherSongs);
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
    const videos = await VideoModel.find().populate('user', 'nickname');
    const sortedVideos = videos.sort((a, b) => {
        const firstElementInteractions = a.likes.length - a.dislikes.length;
        const secondElementInteractions = b.likes.length - b.dislikes.length;

        if (firstElementInteractions > secondElementInteractions) return -1;
        if (firstElementInteractions < secondElementInteractions) return 1;
        return 0;
    });

    seniorSongs = sortedVideos.slice(0, 40);
    io.emit('senior-tracks-update', seniorSongs);
    juniorSongs = sortedVideos.slice(40, 100);
    io.emit('junior-tracks-update', juniorSongs);
    otherSongs = sortedVideos.slice(100);
    io.emit('other-tracks-update', otherSongs);

    songsForQueue = [];
    if (juniorSongs.length > 0) {
        const fiveRandomJuniorSongs = shuffleVideos(juniorSongs).slice(0, 10);
        songsForQueue.push(...fiveRandomJuniorSongs);
    }
    songsForQueue.push(...seniorSongs);
    const shuffledSongsForQueue = shuffleVideos(songsForQueue);

    for (const video of shuffledSongsForQueue) {
        videoQueue.enqueue(video)
    }
    return shuffledSongsForQueue;
}

function shuffleVideos(videos) {
    return videos.sort(() => Math.random() - 0.5);
}

export function getPlayingVideo() {
    const playedTime = moment().diff(currentVideoStartedTime, 'seconds');
    return { playingVideo, playedTime }
}

export function getTracksInQueue() {
    return songsForQueue;
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
            playingVideo.likes = savedVideo.likes;
            playingVideo.dislikes = savedVideo.dislikes;
        } else {
            const queueItems = videoQueue.items().map((item) => {
                if (item._id.toString() === savedVideo._id.toString()) {
                    item.likes = savedVideo.likes;
                    item.dislikes = savedVideo.dislikes
                }
                return item;
            });
            videoQueue.setItems(queueItems);
        }

        io.emit('video-queue-item-update', {
            id: savedVideo._id.toString(),
            likes: savedVideo.likes,
            dislikes: savedVideo.dislikes
        });
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
            playingVideo.likes = savedVideo.likes;
            playingVideo.dislikes = savedVideo.dislikes;
        } else {
            const queueItems = videoQueue.items().map((item) => {
                if (item._id.toString() === savedVideo._id.toString()) {
                    item.likes = savedVideo.likes;
                    item.dislikes = savedVideo.dislikes
                }
                return item;
            });

            videoQueue.setItems(queueItems);
        }

        io.emit('video-queue-item-update', {
            id: savedVideo._id.toString(),
            likes: savedVideo.likes,
            dislikes: savedVideo.dislikes
        });
        return savedVideo;
    } catch (error) {
        console.log(error.message);
    }
}