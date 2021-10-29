import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { readJSON, writeJSON, writeFile, createReadStream } = fs;
const dataJSON = join(dirname(fileURLToPath(import.meta.url)), '../src/DB');

const mediaJSON = join(dataJSON, 'media.json');
const reviewsJSON = join(dataJSON, 'reviews.json');

export const getMedia = () => readJSON(mediaJSON);
export const getReviews = () => readJSON(reviewsJSON);

export const writeMedia = (media) => writeJSON(mediaJSON, media);
export const writeReviews = (review) => writeJSON(reviewsJSON, review);
