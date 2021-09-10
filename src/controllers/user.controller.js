import { createOrUpdateUser } from '../services/user.service.js';
export async function userProfile(req, res, next) {
    try {
        const { nickname, picture, email } = req.oidc.user;
        const user = await createOrUpdateUser(nickname, email, picture);
        return res.json({
            id: user._id.toString(),
            nickname: user.nickname,
            picture: user.picture,
            email: user.email
        });
    } catch (error) {
        next(error);
    }
}