const protectedAuth = (req, res, next) => {
	if (req.user) {
		return next();
	}
	req.session.returnTo = req.originalUrl;
	res.redirect('/login');
};

module.exports = { protectedAuth };
