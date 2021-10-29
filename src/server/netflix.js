import multer from 'multer';
import uniqid from 'uniqid';
import express from 'express';
import createHttpError from 'http-errors';
import { v2 as cloudinary } from 'cloudinary';
import { validationResult } from 'express-validator';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { mediaValidator, reviewValidator } from '../server/validator.js';
import { getMedia, getReviews, writeMedia, writeReviews } from '../fs-tools.js';

const cloudinaryStorage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'posters',
	},
});

const netflixRounter = express.Router();
//......................post ....media.....poster......review.............

netflixRounter.post('/', mediaValidator, async (req, res, next) => {
	try {
		const errorsList = validationResult(req);
		if (!errorsList.isEmpty()) {
			next(createHttpError(400, { errorsList }));
		} else {
			const allMedias = await getMedia();
			const newMedia = {
				...req.body,
				imdbID: uniqid(),
			};
			allMedias.push(newMedia);
			await writeMedia(allMedias);
			res.status(201).send(newMedia);
		}
	} catch (error) {
		next(error);
	}
});

netflixRounter.post(
	'/:id/poster',
	multer({ storage: cloudinaryStorage }).single('moviePoster'),
	async (req, res, next) => {
		try {
			const allMedias = await getMedia();
			const mediaIndex = allMedias.findIndex((p) => p.imdbID === req.params.id);
			const editedMedia = { ...allMedias[mediaIndex], Poster: req.file.path };
			allMedias[mediaIndex] = editedMedia;
			await writeMedia(allMedias);
			res.send(editedMedia);
		} catch (error) {
			next(error);
		}
	},
);

netflixRounter.post('/:id/review', reviewValidator, async (req, res, next) => {
	try {
		const allReview = await getReviews();
		const newReview = {
			...req.body,
			elementId: req.params.id,
			_id: uniqid(),
			createdAt: new Date(),
		};
		allReview.push(newReview);
		await writeReviews(allReview);
		res.status(201).send('Review is successfully added to the database');
	} catch (error) {
		next(error);
	}
});

//......................get ....media..........review.............

netflixRounter.get('/', async (req, res, next) => {
	try {
		const allMedias = await getMedia();
		res.send(allMedias);
	} catch (error) {
		next(error);
	}
});

netflixRounter.get('/:id', async (req, res, next) => {
	try {
		const allMedias = await getMedia();
		const singleMedias = allMedias.filter((p) => p.imdbID === req.params.id);
		res.send(singleMedias);
	} catch (error) {
		next(error);
	}
});

netflixRounter.get('/:id/review', async (req, res, next) => {
	try {
		const allReview = await getReviews();
		const singleReview = allReview.filter((p) => p.elementId === req.params.id);
		res.send(singleReview);
	} catch (error) {
		next(error);
	}
});

//......................put ....media.....poster......review.............

netflixRounter.put('/:id', async (req, res, next) => {
	try {
		const allMedias = await getMedia();
		const mediaIndex = allMedias.findIndex((p) => p.imdbID !== req.params.id);
		const updatedMedia = { ...allMedias[mediaIndex], ...req.body };
		allMedias[mediaIndex] = updatedMedia;
		await writeMedia(allMedias);
		res.send(updatedMedia);
	} catch (error) {
		next(error);
	}
});

netflixRounter.put('/:id/review', async (req, res, next) => {
	try {
		const allReview = await getReviews();
		const reviewIndex = allReview.findIndex((p) => p._iD !== req.params.id);
		const updatedReview = { ...allReview[reviewIndex], ...req.body };
		allReview[reviewIndex] = updatedReview;
		await writeReviews(allReview);
		res.send(updatedReview);
	} catch (error) {
		next(error);
	}
});

netflixRounter.put(
	'/:id/poster',
	multer({ storage: cloudinaryStorage }).single('moviePoster'),
	async (req, res, next) => {
		try {
			const allMedias = await getMedia();
			const mediaIndex = allMedias.findIndex((p) => p.imdbID === req.params.id);
			const editedMedia = { ...allMedias[mediaIndex], Poster: req.file.path };
			allMedias[mediaIndex] = editedMedia;
			await writeMedia(allMedias);
			res.send(editedMedia);
		} catch (error) {
			next(error);
		}
	},
);

//......................delete ....media.....poster......review.............

netflixRounter.delete('/:id', async (req, res, next) => {
	try {
		const allMedias = await getMedia();
		const singleMediaOut = allMedias.filter((p) => p.imdbID !== req.params.id);
		await writeMedia(singleMediaOut);
		res.status(204).send();
	} catch (error) {
		next(error);
	}
});

netflixRounter.delete('/:id/review', async (req, res, next) => {
	try {
		const allReview = await getReviews();
		const oneReviewOut = allReview.filter((p) => p._id !== req.params.id);
		await writeReviews(oneReviewOut);
		res.status(204).send();
	} catch (error) {
		next(error);
	}
});

export default netflixRounter;
