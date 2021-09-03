const router = require('express').Router();
const videoController = require('../controllers/video.controller');
const { requiresAuth } = require('express-openid-connect');
const { checkReqParam } = require('../middlewares/validate.middleware');

module.exports = () => {
    router.route('/').post(videoController.createVideo).get(videoController.getAll);

    router
        .route('/like/:id')
        .all(requiresAuth(), checkReqParam)
        .post(videoController.likeVideo)
        .delete(videoController.unLikeVideo);
    router
        .route('/dislike/:id')
        .all(requiresAuth(), checkReqParam)
        .post(videoController.dislikeVideo)
        .delete(videoController.unDislikeVideo);
    router.get('/count/:id', checkReqParam, videoController.getLikeAndDisLike);
    router.get('/search', requiresAuth(), videoController.searchYoutube);
    router.get('/:id', checkReqParam, videoController.getById);
    router.delete('/:id', requiresAuth(), checkReqParam, videoController.deleteVideo);
    return router;
};