const router = require('express').Router();
const videoController = require('../controllers/video.controller');
const { checkJwt } = require('../middlewares/auth.middleware');

module.exports = () => {
	router.get('/', videoController.getAll);
	router.route('/like', checkJwt).post(videoController.likeVideo).delete(videoController.unLikeVideo);
	router.route('/dislike', checkJwt).post(videoController.dislikeVideo).delete(videoController.unDislikeVideo);
	router.get('/count', videoController.getLikeAndDisLike);
	router.route('/:id').get(videoController.getById).delete(checkJwt, videoController.deleteVideo);
	return router;
};
