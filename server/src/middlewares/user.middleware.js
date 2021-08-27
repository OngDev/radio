const getUser = (req, res, next) => {
	res.locals.user = req.user;
	next();
};

module.exports = { getUser };
