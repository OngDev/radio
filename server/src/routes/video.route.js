const router = require('express').Router();
const videoController = require('../controllers/video.controller');
const { checkJwt } = require('../middlewares/auth.middleware');
const { checkReqParam } = require('../middlewares/validate.middleware');

module.exports = () => {
	router.get('/', videoController.getAll);
	router
		.route('/like/:id')
		.all(checkJwt, checkReqParam)
		.post(videoController.likeVideo)
		.delete(videoController.unLikeVideo);
	router
		.route('/dislike/:id')
		.all(checkJwt, checkReqParam)
		.post(videoController.dislikeVideo)
		.delete(videoController.unDislikeVideo);
	router.get('/count/:id', checkReqParam, videoController.getLikeAndDisLike);
	router.get('/:id', checkReqParam, videoController.getById);
	router.delete('/:id', checkJwt, checkReqParam, videoController.deleteVideo);
	return router;
};
