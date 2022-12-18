const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, resp, next, val) => {
  console.log(`tour id is: ${val}`);

  if (req.params.id * 1 > tours.length) {
    return resp.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, resp, next) => {
  console.log(`tour Name is: ${req.body.name} and Price is: ${req.body.price}`);

  if (!req.body.name || !req.body.price) {
    return resp.status(400).json({
      status: 'fail. Bad request',
      message: 'Invalid Name or Price of rote',
    });
  }
  next();
};

exports.getAllTours = (req, resp) => {
  resp.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.getTourById = (req, resp) => {
  console.log(req.params);

  const tour = tours.find((el) => el.id === req.params.id * 1);

  resp.status(200).json({
    status: 'success',
    RequestedAt: req.requestTime,
    data: {
      tour,
    },
  });
};

exports.insertTour = (req, resp) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      resp.status(201).json({
        status: 'success',
        data: {
          newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, resp) => {
  resp.status(200).json({
    status: 'success',
    data: '<Updated tour>',
  });
};

exports.removeTour = (req, resp) => {
  resp.status(204).json({
    status: 'success',
    data: null,
  });
};
