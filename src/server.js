import cors from 'cors';
import express from 'express';
import Endpoints from 'express-list-endpoints';
import netflixRounter from '../src/server/netflix.js';
import {
	badRequestHandler,
	unAuterizedHandler,
	notFoundHandler,
	genericErrorHandler,
} from './errorHandler.js';

const server = express();

const whitelist = [process.env.FE_LOCAL_URL, process.env.FE_PROD_URL];
const corsOpt = {
	origin: function (origin, next) {
		if (!origin || whitelist.indexOf(origin) !== -1) {
			next(null, true);
		} else {
			next(new Error(404, 'CORS ERROR'));
		}
	},
};

server.use(cors(corsOpt));
server.use(express.json());

server.use('/media', netflixRounter);
server.use('/media', netflixRounter);

server.use(badRequestHandler);
server.use(unAuterizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

const port = process.env.PORT;
console.table(Endpoints(server));
server.listen(port, () => {
	console.log('server-', port);
});
