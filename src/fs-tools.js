import fs from 'fs-extra';
import PdfPrinter from 'pdfmake';
import { promisify } from 'util';
import { pipeline } from 'stream';
import striptags from 'striptags';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import axios from 'axios';
import sgMail from '@sendgrid/mail';

const { readJSON, writeJSON, writeFile, createReadStream, createWriteStream } =
	fs;
const dataJSON = join(dirname(fileURLToPath(import.meta.url)), '../src/DB');

const mediaJSON = join(dataJSON, 'media.json');
const reviewsJSON = join(dataJSON, 'reviews.json');

export const getMedia = () => readJSON(mediaJSON);
export const getReviews = () => readJSON(reviewsJSON);

export const writeMedia = (media) => writeJSON(mediaJSON, media);
export const writeReviews = (review) => writeJSON(reviewsJSON, review);

export const readMediaStream = () => createReadStream(mediaJSON);
export const readReviewsStream = () => createReadStream(reviewsJSON);

/********************************pdf****************************************/

const fonts = {
	Helvetica: {
		normal: 'Helvetica',
		bold: 'Helvetica-Bold',
	},
};
const printer = new PdfPrinter(fonts);

export const pdfReviewStreaming = () => {};

export const pdfMediaStreaming = () => {};

export const generetPDFMediafile = async (data) => {
	let imagePart = {};
	if (data.Poster) {
		const response = await axios.get(data.Poster, {
			responseType: 'arraybuffer',
		});
		const imgNameURL = data.Poster.split('/');
		const imgName = imgNameURL[imgNameURL.length - 1];
		const [id, extention] = imgName.split('.');
		const base64 = response.toString('base64');
		const base64Image = `data:image/${extention};base64,${base64}`;
		imagePart = { image: base64Image, width: 500, margin: [0, 0, 0, 40] };
	}

	const docDefinition = {
		content: [
			//imagePart,
			{
				text: striptags(data.Title),
				fontSize: 25,
				bold: true,
				margin: [0, 0, 0, 10],
			},
			{
				text: striptags(data.Year),
				fontSize: 15,
				bold: true,
				margin: [0, 0, 0, 10],
			},
			{ text: striptags(data.Type), fontSize: 15, margin: [0, 0, 0, 10] },
		],
		defaultStyle: {
			font: 'Helvetica',
		},
	};
	const pdfMedia = printer.createPdfKitDocument(docDefinition);
	return pdfMedia;
};

export const generatePDFAsync = async (data) => {
	const fonts = {
		Helvetica: {
			normal: 'Helvetica',
			bold: 'Helvetica-Bold',
		},
	};
	const printer = new PdfPrinter(fonts);

	const asyncPipeline = promisify(pipeline);

	const docDefinition = {
		content: [
			'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines',
		],
		defaultStyle: {
			font: 'Helvetica',
		},
	};

	const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
	pdfReadableStream.end();
	const path = join(dirname(fileURLToPath(import.meta.url)), 'example.pdf');
	await asyncPipeline(pdfReadableStream, fs.createWriteStream(path));
	return path;
};

/********************************email****************************************/

sgMail.setApiKey(process.env.SENDGRID_KEY);

export const sendRegistrationEmail = async (reciveraddress) => {
	const msg = {
		to: reciveraddress,
		from: process.env.SENDERS_ADDRESS,
		cc: process.env.SENDERS_ADDRESS,
		subject: 'Registration',
		text: 'Registration confermation',
		html: '<strong> lol.com/lol</strong>',
	};
	await sgMail.send(msg);
};

/********************************email****************************************/
