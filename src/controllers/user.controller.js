export async function userProfile(req, res, next) {
    try {
        const { nickname, picture } = req.oidc.user;
        return res.json({ nickname, picture });
    } catch (error) {
        next(error);
    }
}