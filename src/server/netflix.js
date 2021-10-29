import multer from 'multer';
import uniqid from 'uniqid';
import express from 'express';
import createHttpError from 'http-errors';
import { mediaValidator } from '../server/validator.js';
import { validationResult, reviewValidator } from 'express-validator';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const cloudinaryStorage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'posters',
	},
});

const netflixRounter = express.Router();

netflixRounter.post('/', mediaValidator, async (req, res, next) => {
	try {
		const errorsList = validationResult(req);
		if (!errorsList.isEmpty()) {
			next(createHttpError(400, { errorsList }));
		} else {
			const author = await getAuthor();
			const newAuthor = {
				...req.body,
				createdAt: new Date(),
				id: uniqid(),
			};
			author.push(newAuthor);
			await writeAuthor(author);
			res.status(201).send('Post created');
		}
	} catch (error) {
		next(error);
	}
});

netflixRounter.post('/:id', async (req, res, next) => {
	try {
	} catch (error) {
		next(error);
	}
});

netflixRounter.post('/:id', reviewValidator, async (req, res, next) => {
	try {
	} catch (error) {
		next(error);
	}
});

netflixRounter.get('/', async (req, res, next) => {
	try {
	} catch (error) {
		next(error);
	}
});

netflixRounter.get('/:id', async (req, res, next) => {
	try {
	} catch (error) {
		next(error);
	}
});

netflixRounter.put('/:id', async (req, res, next) => {
	try {
	} catch (error) {
		next(error);
	}
});

netflixRounter.put('/:id', async (req, res, next) => {
	try {
	} catch (error) {
		next(error);
	}
});

netflixRounter.delete('/:id', async (req, res, next) => {
	try {
	} catch (error) {
		next(error);
	}
});

export default netflixRounter;
