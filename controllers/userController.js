const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllUsers = catchAsync(async (req, resp, next) => {
  const users = await User.find();

  //send responce
  resp.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.insretUser = (req, resp) => {
  resp
    .status(500)
    .json({ status: 'error', massge: 'This route is not yet defined' });
};

exports.getUserById = (req, resp) => {
  resp
    .status(500)
    .json({ status: 'error', massge: 'This route is not yet defined' });
};

exports.updateUser = (req, resp) => {
  resp
    .status(500)
    .json({ status: 'error', massge: 'This route is not yet defined' });
};

exports.removeUser = (req, resp) => {
  resp
    .status(500)
    .json({ status: 'error', massge: 'This route is not yet defined' });
};
