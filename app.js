const express = require('express');
const morgan = require('morgan');
// eslint-disable-next-line prettier/prettier

const tourRouter = require('./routes/tourRoutes');

const userRouter = require('./routes/userRoutes');

const app = express();

// 1. Mddlewares
//console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, resp, next) => {
  console.log('Middleware logger test');
  next();
});

app.use((req, resp, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//import routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Start the server
module.exports = app;
