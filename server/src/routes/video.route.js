const router = require('express').Router();
const videoController = require('../controllers/video.controller');
const { checkJwt } = require('../middlewares/auth.middleware');

module.exports = () => {
	router.get('/', videoController.getAll);
	router.route('/like/:id', checkJwt).post(videoController.likeVideo).delete(videoController.unLikeVideo);
	router.route('/dislike/:id', checkJwt).post(videoController.dislikeVideo).delete(videoController.unDislikeVideo);
	router.get('/count/:id', videoController.getLikeAndDisLike);
	router.route('/:id').get(videoController.getById).delete(checkJwt, videoController.deleteVideo);
	return router;
};
