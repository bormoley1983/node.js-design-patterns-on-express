const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Natours API',
      version: '1.0.0',
      description: 'API documentation for Natours application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

// Root route - API information
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Natours API!',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
    endpoints: {
      tours: `${req.protocol}://${req.get('host')}/api/v1/tours`,
      users: `${req.protocol}://${req.get('host')}/api/v1/users`,
      documentation: `${req.protocol}://${req.get('host')}/api-docs`
    },
    version: '1.0.0'
  });
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, resp, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

//Start the server
module.exports = app;
