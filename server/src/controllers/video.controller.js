const videoService = require('../services/video.service');
const likeService = require('../services/like.service');
const dislikeService = require('../services/dislike.service');

async function getById(req, res, next) {
	try {
		const id = req.params;
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
		const video = await videoService.createVideo(req.body);
		return res.json(video);
	} catch (error) {
		next(error);
	}
}

async function deleteVideo(req, res, next) {
	try {
		return await videoService.deleteVideo(req.params);
	} catch (error) {
		next(error);
	}
}

async function likeVideo(req, res, next) {
	try {
		return await likeService.like();
	} catch (error) {
		next(error);
	}
}

async function unLikeVideo(req, res, next) {
	try {
		return await likeService.unLike();
	} catch (error) {
		next(error);
	}
}

async function dislikeVideo(req, res, next) {
	try {
		return await dislikeService.dislike();
	} catch (error) {
		next(error);
	}
}

async function unDislikeVideo(req, res, next) {
	try {
		return await dislikeService.unDislike();
	} catch (error) {
		next(error);
	}
}

async function getLikeAndDisLike(req, res, next) {
	try {
		const videoId = req.body.videoId;
		const likes = await likeService.countLike(videoId);
		const dislikes = await dislikeService.countDislike(videoId);
		return res.json({ likes, dislikes });
	} catch (error) {
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
};
