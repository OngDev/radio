import express from 'express';
import openId from 'express-openid-connect';
import { createVideo, getAll, toggleLikeVideo, toggleDislikeVideo, searchYoutube, getById, deleteVideo } from '../controllers/video.controller.js';

const Router = express.Router;
const router = Router();
export default () => {
    router.route('/').post(createVideo).get(getAll);

    router
        .route('/:id/togglelike')
        .all(openId.requiresAuth())
        .post(toggleLikeVideo);
    router
        .route('/:id/toggledislike')
        .all(openId.requiresAuth())
        .post(toggleDislikeVideo);
    router.get('/search', openId.requiresAuth(), searchYoutube);
    router.get('/:id', getById);
    router.delete('/:id', openId.requiresAuth(), deleteVideo);
    return router;
};