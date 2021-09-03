const videoService = require('../services/video.service');
const likeService = require('../services/like.service');
const dislikeService = require('../services/dislike.service');

async function getById(req, res, next) {
    try {
        const id = req.params.id;
        const video = await videoService.getVideoById(id);
        return res.json(video);
    } catch (error) {
        next(error);
    }
}

async function getAll(req, res, next) {
    try {
        const videos = await videoService.getAll();
        return res.json(videos);
    } catch (error) {
        next(error);
    }
}

async function createVideo(req, res, next) {
    try {
        const video = await videoService.createVideo({...req.body, authorEmail: req.oidc.user.email });
        return res.json(video);
    } catch (error) {
        next(error);
    }
}

async function deleteVideo(req, res, next) {
    try {
        const { email } = req.oidc.user;
        if (email !== 'milonguyen95@outlook.com' || email !== 'admin@ongdev.com') {
            return res.status(401).end();
        }
        const videoId = req.params.id;
        return await videoService.deleteVideo(videoId);
    } catch (error) {
        next(error);
    }
}

async function likeVideo(req, res, next) {
    try {
        const videoId = req.params.id;
        return await likeService.like(req.oidc.user.email, videoId);
    } catch (error) {
        next(error);
    }
}

async function unLikeVideo(req, res, next) {
    try {
        const videoId = req.params.id;
        return await likeService.unLike(req.oidc.user.email, videoId);
    } catch (error) {
        next(error);
    }
}

async function dislikeVideo(req, res, next) {
    try {
        const videoId = req.params.id;
        return await dislikeService.dislike(req.oidc.user.email, videoId);
    } catch (error) {
        next(error);
    }
}

async function unDislikeVideo(req, res, next) {
    try {
        const userId = req.user;
        const videoId = req.params.id;
        return await dislikeService.unDislike(userId, videoId);
    } catch (error) {
        next(error);
    }
}

async function getLikeAndDisLike(req, res, next) {
    try {
        const videoId = req.params.id;
        const likes = await likeService.countLike(videoId);
        const dislikes = await dislikeService.countDislike(videoId);
        return res.json({ likes, dislikes });
    } catch (error) {
        next(error);
    }
}

async function searchYoutube(req, res, next) {
    try {
        console.log(req.query)
        const keyword = req.query.keyword;
        if (!keyword) return res.json([]);
        const videos = await videoService.searchYoutube(keyword);
        return res.json(videos);
    } catch (error) {
        console.log(error.message)
        next(error);
    }
}

module.exports = {
    getById,
    getAll,
    createVideo,
    deleteVideo,
    likeVideo,
    unLikeVideo,
    dislikeVideo,
    unDislikeVideo,
    getLikeAndDisLike,
    searchYoutube
};