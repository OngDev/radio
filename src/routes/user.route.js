import { Router } from 'express';
import openId from 'express-openid-connect';
import { userProfile } from '../controllers/user.controller.js';

const router = Router();
export default () => {
    router.get('/me', openId.requiresAuth(), userProfile);
    return router;
};