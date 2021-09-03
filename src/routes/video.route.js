const router = require('express').Router();
const videoController = require('../controllers/video.controller');
const { requiresAuth } = require('express-openid-connect');
// const { checkReqParam } = require('../middlewares/validate.middleware');

module.exports = () => {
    router.route('/').post(videoController.createVideo).get(videoController.getAll);

    router
        .route('/like/:id')
        .all(requiresAuth())
        .post(videoController.likeVideo)
        .delete(videoController.unLikeVideo);
    router
        .route('/dislike/:id')
        .all(requiresAuth())
        .post(videoController.dislikeVideo)
        .delete(videoController.unDislikeVideo);
    router.get('/count/:id', videoController.getLikeAndDisLike);
    router.get('/search', requiresAuth(), videoController.searchYoutube);
    router.get('/:id', videoController.getById);
    router.delete('/:id', requiresAuth(), videoController.deleteVideo);
    return router;
};