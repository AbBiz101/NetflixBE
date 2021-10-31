import multer from 'multer';
import uniqid from 'uniqid';
import { createGzip } from 'zlib';
import express from 'express';
import { pipeline } from 'stream';
import createHttpError from 'http-errors';
import { v2 as cloudinary } from 'cloudinary';
import { validationResult } from 'express-validator';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { mediaValidator, reviewValidator } from '../server/validator.js';
import {
	getMedia,
	getReviews,
	writeMedia,
	writeReviews,
	readMediaStream,
	readReviewsStream,
	pdfMediaStream,
	generetPDFMediafile,
} from '../fs-tools.js';
import PdfPrinter from 'pdfmake';
import striptags from 'striptags';
import axios from 'axios';

const cloudinaryStorage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'posters',
	},
});

const fonts = {
	Helvetica: {
		normal: 'Helvetica',
		bold: 'Helvetica-Bold',
	},
};

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
	multer({ storage: cloudinaryStorage }).single('Poster'),
	async (req, res, next) => {
		try {
			const allMedias = await getMedia();
			const media = allMedias.find((p) => p.imdbID === req.params.id);
			const mediaArr = allMedias.filter((p) => p.imdbID !== req.params.id);
			media.Poster = req.file.path;
			mediaArr.push(media);
			console.log(media);
			await writeMedia(mediaArr);
			res.send(media);
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
	multer({ storage: cloudinaryStorage }).single('Poster'),
	async (req, res, next) => {
		try {
			const allMedias = await getMedia();
			const media = allMedias.find((p) => p.imdbID === req.params.id);
			const mediaArr = allMedias.filter((p) => p.imdbID !== req.params.id);
			media.Poster = req.file.path;
			mediaArr.push(media);
			await writeMedia(mediaArr);
			res.send(media);
		} catch (error) {
			next(error);
		}
	},
);

//......................download ....PDF.....JSON......CSV.............

netflixRounter.get('/download/JSON', async (req, res, next) => {
	try {
		res.setHeader(
			'Content-Disposition',
			'attachment; filename=All_Medias.json',
		);

		const source = readMediaStream();
		const transform = createGzip(); // if u want to make it comprossed file add this =>  filename=All_Medias.json.gz  and (source,transform ,destination,)
		const destination = res;

		pipeline(source, destination, (err) => {
			if (err) next(err);
		});
	} catch (error) {
		next(error);
	}
});

netflixRounter.get('/:id/pdf', async (req, res, next) => {
	try {
		const allMedias = await getMedia();
		const [singleMedias] = allMedias.filter((p) => p.imdbID === req.params.id);

		const pdfStream = await generetPDFMediafile(singleMedias);
		res.setHeader('Content-Type', 'application/pdf');
		pdfStream.pipe(res);
		pdfStream.end();
	} catch (error) {
		next(error);
	}
});

netflixRounter.get('/download/PDF', (req, res, next) => {
	try {
		res.setHeader('Content-Disposition', 'attachment; filename=All_Medias.pdf');

		const source = pdfMediaStream();
		const destination = res;

		pipeline(source, destination, (err) => {
			if (err) next(err);
		});
	} catch (error) {
		next(error);
	}
});

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
