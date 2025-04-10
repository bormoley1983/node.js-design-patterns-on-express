const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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

exports.updateMe = catchAsync(async (req, resp, next) => {
  // 1. create an error if user tries to update the password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates, please use update-password',
        400,
      ),
    );
  }

  //2 filter unwanted fields from being updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3. update the user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  resp.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.insretUser = (req, resp) => {
  resp
    .status(500)
    .json({ status: 'error', massge: 'This route is not yet defined' });
};

exports.deleteMe = catchAsync(async (req, resp, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  resp.status(204).json({
    status: 'success',
    data: null,
  });
});

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
