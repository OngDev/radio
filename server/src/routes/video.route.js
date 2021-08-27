const router = require('express').Router();
const videoController = require('../controllers/video.controller');

module.exports = () => {
	router.get('/', videoController.getAll);
	router.route('/like').post(videoController.likeVideo).delete(videoController.unLikeVideo);
	router.route('/dislike').post(videoController.dislikeVideo).delete(videoController.unDislikeVideo);
	router.get('/count', videoController.getLikeAndDisLike);
	router.route('/:id').get(videoController.getById).delete(videoController.deleteVideo);
	return router;
};
