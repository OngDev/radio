const { errorHandler, APIError } = require('../utils/error.util');

function handleNotFoundPage(req, res) {
	return res.status(404).json({ message: 'Page not found' });
}

function handleError(err, req, res, next) {
	if (err.name === 'MongoError' && err.code === 11000) {
		let [_, collection, field, value] = err.message.match(
			/collection: [a-z]*\.([a-z]*)\sindex:\s([a-z]+).*{\s?[a-zA-z0-9]*:\s?"?([a-z0-9@. ]+)"?/i
		);
		err = new APIError({
			message: ` ${collection} exist ${field} : ${value}`,
			status: 409,
		});
	}
	if (err) {
		err = new APIError({
			message: err.message,
			status: err.status || 500,
			errors: err.error,
			isOperational: errorHandler.isTrustedError(err) ? true : false,
		});
	}
	return res.status(err.status).json(err);
}

module.exports = { handleNotFoundPage, handleError };
