export async function userProfile(req, res, next) {
    try {
        const { nickname, picture, email } = req.oidc.user;
        return res.json({ nickname, picture, email });
    } catch (error) {
        next(error);
    }
}