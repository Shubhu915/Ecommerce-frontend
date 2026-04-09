const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('./middlewares/mongoSanitize');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// Sanitize data
app.use(mongoSanitize);

// Enable CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

const routes = require('./routes');
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to E-commerce API',
        version: '1.0.0',
        docs: '/api/v1/frontend-api-docs (see frontend_api_docs.md file)'
    });
});
app.use('/api/v1', routes);

// Send back a 404 error for any unknown api request
app.use((req, res, next) => {
    console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
    next(new ApiError(404, 'Not found'));
});

// Handle error
app.use(errorHandler);

module.exports = app;
