const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1. GLOBAL Mddlewares
//SET SECURITY HTTP HEADERS
app.use(helmet());

//DEVELOPMENT LOGGING
//console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

//SET SECURITY LIMIT REQUESTS
app.use('/api', limiter);

//BODY PARSER, reading data from body to req.body
app.use(express.json({ limit: '10kb' }));

//DATA SANITIZATION against NOSQL query injection
app.use(mongoSanitize());

//DATA SANITIZATION against cross-site scripting attacks
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//Serving static files
app.use(express.static(`${__dirname}/public`));

// app.use((req, resp, next) => {
//   console.log('Middleware logger test');
//   next();
// });

//Test Middleware
app.use((req, resp, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);
  next();
});

//import routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, resp, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

//Start the server
module.exports = app;
