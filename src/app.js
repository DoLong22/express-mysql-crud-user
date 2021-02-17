import express from 'express';
import logger from 'morgan';
import path from 'path';
import rfs from 'rotating-file-stream';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { respondWithError } from './helpers/messageResponse';
import i18n from './middleware/i18n';
import routerManager from './routes';

// error handler
import { ErrorCodes } from './helpers/constants';

require('./models');

const app = express();

app.use(helmet());
app.use(i18n);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// cors  configuration
const corsOptions = {
    origin: '*',
    methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
    exposedHeaders: ['Content-Length', 'Authorization', 'Accept-Language'],
    credentials: true,

};

app.use(cors(corsOptions));

// log configuration
const accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, '../logs'),
});

// setup the logger
app.use(logger('combined', { stream: accessLogStream }));

routerManager(app);

app.use(express.static(path.join(__dirname, '../public')));

// 404 error
app.use((req, res) => {
    res.json(respondWithError(ErrorCodes.ERROR_CODE_API_NOT_FOUND, 'API not found'));
});
// 500 error
app.use((err, req, res) => {
    // eslint-disable-next-line no-console
    console.log(`500 error: ${err.message}`);
    res.json(respondWithError(ErrorCodes.ERROR_CODE_SYSTEM_ERROR, `System error: ${err.message}`, err));
});

module.exports = app;
