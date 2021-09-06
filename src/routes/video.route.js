import express from 'express';
import openId from 'express-openid-connect';
import rateLimit from 'express-rate-limit';
import { createVideo, getAll, likeVideo, unLikeVideo, dislikeVideo, unDislikeVideo, getLikeAndDisLike, searchYoutube, getById, deleteVideo } from '../controllers/video.controller.js';
// const { checkReqParam } = require('../middlewares/validate.middleware');

const Router = express.Router;
const router = Router();
export default () => {
    router.route('/').post(createVideo).get(getAll);

    router
        .route('/like/:id')
        .all(openId.requiresAuth())
        .post(likeVideo)
        .delete(unLikeVideo);
    router
        .route('/dislike/:id')
        .all(openId.requiresAuth())
        .post(dislikeVideo)
        .delete(unDislikeVideo);
    router.get('/count/:id', getLikeAndDisLike);
    router.get('/search', openId.requiresAuth(), searchYoutube);
    router.get('/:id', getById);
    router.delete('/:id', openId.requiresAuth(), deleteVideo);
    return router;
};