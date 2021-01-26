import express from 'express';
import bodyParser from 'body-parser';
import logging from './config/logging';
import { routes } from './routes';

const NAMESPACE = 'Server';
const app = express();

/** Logging the request */
app.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD 0 [${req.method}], URL - [${req.url}, IP - [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD 0 [${req.method}], URL - [${req.url}, IP - [${req.socket.remoteAddress}], STATUS  - [${res.statusCode}]`);
    });

    next();
});

/** Parse the request */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** Rules of the API */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATC DELETE POST PUT');
        return res.status(200).json({});
    }

    next();
});

/** Routes */
app.use('/', routes);

/** Error Handling */
app.use((req, res, next) => {
    const error = new Error('Service not found');
    return res.status(404).json({ message: error.message });
});

export { app };
