import { getVideoById, getAll as _getAll, createVideo as _createVideo, deleteVideo as _deleteVideo } from '../services/video.service.js';
import { like, unLike, countLike } from '../services/like.service.js';
import { dislike, unDislike, countDislike } from '../services/dislike.service.js';
import { searchYoutube as _searchYoutube } from '../services/youtube.service.js';

export async function getById(req, res, next) {
    try {
        const id = req.params.id;
        const video = await getVideoById(id);
        return res.json(video);
    } catch (error) {
        next(error);
    }
}

export async function getAll(req, res, next) {
    try {
        const videos = await _getAll();
        return res.json(videos);
    } catch (error) {
        next(error);
    }
}

export async function createVideo(req, res, next) {
    try {
        const video = await _createVideo(req.body.youtubeVideoId, req.oidc.user.email);
        return res.json(video);
    } catch (error) {
        next(error);
    }
}

export async function deleteVideo(req, res, next) {
    try {
        const { email } = req.oidc.user;
        if (email !== 'milonguyen95@outlook.com' || email !== 'admin@ongdev.com') {
            return res.status(401).end();
        }
        const videoId = req.params.id;
        return await _deleteVideo(videoId);
    } catch (error) {
        next(error);
    }
}

export async function likeVideo(req, res, next) {
    try {
        const videoId = req.params.id;
        await like(req.oidc.user.email, videoId);
        res.send('Sucess')
    } catch (error) {
        next(error);
    }
}

export async function unLikeVideo(req, res, next) {
    try {
        const videoId = req.params.id;
        await unLike(req.oidc.user.email, videoId);
        res.send('Sucess')
    } catch (error) {
        next(error);
    }
}

export async function dislikeVideo(req, res, next) {
    try {
        const videoId = req.params.id;
        await dislike(req.oidc.user.email, videoId);
        res.send('Sucess')
    } catch (error) {
        next(error);
    }
}

export async function unDislikeVideo(req, res, next) {
    try {
        const userId = req.user;
        const videoId = req.params.id;
        await unDislike(userId, videoId);
        res.send('Sucess')
    } catch (error) {
        next(error);
    }
}

export async function getLikeAndDisLike(req, res, next) {
    try {
        const videoId = req.params.id;
        const likes = await countLike(videoId);
        const dislikes = await countDislike(videoId);
        return res.json({ likes, dislikes });
    } catch (error) {
        next(error);
    }
}

export async function searchYoutube(req, res, next) {
    try {
        const keyword = req.query.keyword;
        if (!keyword) return res.json([]);
        const videos = await _searchYoutube(keyword);
        return res.json(videos);
    } catch (error) {
        console.log(error.message)
        next(error);
    }
}