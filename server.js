const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

//console.log(process.env);

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD,
// );
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    //.connect(DB, {
    useUnifiedTopology: true,
    //useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndMoify: false,
  })
  .then(() => console.log('Connection Established!'));
//  .catch((err) => console.log('ERROR!'));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejetcion! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
