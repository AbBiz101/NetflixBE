import multer from 'multer';
import uniqid from 'uniqid';
import express from 'express';
import createHttpError from 'http-errors';
// import { authorValidator } from '../author/validator.js';
import { validationResult } from 'express-validator';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const cloudinaryStorage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'posters',
	},
});

const netflixRounter = express.Router();

netflixRounter.post('/', async (req, res, next) => {
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
netflixRounter.delete('/:id', async (req, res, next) => {
	try {
	} catch (error) {
		next(error);
	}
});
export default netflixRounter;
