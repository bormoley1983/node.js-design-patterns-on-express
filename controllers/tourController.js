//const fs = require('fs');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
// exports.checkID = (req, resp, next, val) => {
//   console.log(`tour id is: ${val}`);
// exports.checkBody = (req, resp, next) => {
//   console.log(`tour Name is: ${req.body.name} and Price is: ${req.body.price}`);
//   if (!req.body.name || !req.body.price) {
//     return resp.status(400).json({
//       status: 'fail. Bad request',
//       message: 'Invalid Name or Price of rote',
//     });
//   }
//   next();
// };
const { query } = require('express');
const Tour = require('./../models/tourModel');

// const testTour = new Tour({
//   name: 'The park camper',
//   price: 997,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// if (req.params.id * 1 > tours.length) {
//   return resp.status(404).json({
//     status: 'fail',
//     message: 'Invalid ID',
//   });
// }
// next();
// };

exports.getAllTours = async (req, resp) => {
  try {
    //build the query
    //1a filtering
    const queryObj = { ...req.query };

    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((el) => delete queryObj[el]);

    //1b advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    //console.log(JSON.parse(queryStr));
    //console.log(req.query, queryObj);

    let query = Tour.find(JSON.parse(queryStr));

    //2 sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query.sort(sortBy);
      //sort('price ratingsAverage' )
    } else {
      query.sort('-createdAt');
    }

    //3 field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //4 pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    //page=2&limit=10
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    //execute query
    const tours = await query;
    //query.sort().select().skip.Limit()

    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy',
    // });

    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    //send responce
    resp.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    resp.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTourById = async (req, resp) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //     const tour = await Tour.findOne({_id: req.params.id}});

    resp.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    resp.status(404).json({
      status: 'fail',
      message: err,
    });
  }
  //  console.log(req.params);
  // const tour = tours.find((el) => el.id === req.params.id * 1);
  // resp.status(200).json({
  //   status: 'success',
  //   RequestedAt: req.requestTime,
  //   data: {
  //     tour,
  //   },
  // });
};

exports.insertTour = async (req, resp) => {
  try {
    // const newTour = new Tour({});
    // newTour.save();

    //  Tour.create({}).then();
    const newTour = await Tour.create(req.body);
    resp.status(201).json({
      status: 'success',
      data: {
        newTour,
      },
    });
  } catch (err) {
    resp.status(400).json({
      status: 'fail',
      message: err, //'Invalid dataset', //err
    });
  }
};
// const newId = tours[tours.length - 1].id + 1;
// const newTour = Object.assign({ id: newId }, req.body);
// tours.push(newTour);
// fs.writeFile(
//   `${__dirname}/dev-data/data/tours-simple.json`,
//   JSON.stringify(tours),
//   (err) => {
//     resp.status(201).json({
//       status: 'success',
//       data: {
//         newTour,
//       },
//     });
//   }
// );
// };

exports.updateTour = async (req, resp) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    resp.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    resp.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.removeTour = async (req, resp) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    resp.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    resp.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
