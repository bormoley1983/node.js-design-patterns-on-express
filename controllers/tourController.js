const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, resp, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, resp) => {
  try {
    //execute query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;
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
