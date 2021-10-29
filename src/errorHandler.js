export const badRequestHandler = (err, req, res, next) => {
	if (err.status === 400) {
		res.status(400).send({ message: err.errorsList || 'Bad request' });
	} else {
		next(err);
	}
};
export const unAuterizedHandler = (err, req, res, next) => {
	if (err.status === 401) {
		res.status(401).send({ message: 'Unautorized User' });
	} else {
		next(err);
	}
};
export const notFoundHandler = (err, req, res, next) => {
	if (err.status === 404) {
		res.status(404).send({ message: err.message || 'Page not found' });
	} else {
		next(err);
	}
};
export const genericErrorHandler = (err, req, res, next) => {
	res.status(500).send({ message: err.message });
};
