import { body } from 'express-validator';
export const mediaValidator = [
	body('Title').exists().withMessage('Title of the movie is mandatory field.'),
	body('Type').exists().withMessage('Type is mandatory field.'),
	body('Year').exists().withMessage('Year is mandatory field.'),
	body('Poster').exists().withMessage('avatar is mandatory field.'),
];

export const reviewValidator = [
	body('comment').exists().withMessage('comment is mandatory field.'),
	body('rate').exists().withMessage('rate is mandatory field.'),
	body('elementId').exists().withMessage('elementId is mandatory field.'),
];
