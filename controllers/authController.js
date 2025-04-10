const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, resp, next) => {
  //const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  // const token = signToken(newUser._id);
  // jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });

  createSendToken(newUser, 201, resp);
});

exports.login = catchAsync(async (req, resp, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password exist
  if (!email || !password) {
    return next(new ('Please provide email and password!', 400)());
  }

  // 2. Check if the user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3. IF all OK - sen JWT to customer
  createSendToken(user, 200, resp);
});

exports.protect = catchAsync(async (req, resp, next) => {
  //1 Getting the token and check if it is existing one
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  //console.log(token);

  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access', 401),
    );
  }

  //2 Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //console.log(decoded);

  //3 Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to the token does not longer exist',
        401,
      ),
    );
  }

  //4 Check if user changed password after the JWT was issuet
  if (freshUser.ChangedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please Login again', 401),
    );
  }

  //grant access to protected route
  req.user = freshUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, resp, next) => {
    //roles is an array ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, resp, next) => {
  //1 get user using email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  //generte random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send it back as an email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/reset-password/${resetToken}`;

  const message = `Forgot your password? submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you did not forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    resp.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpired = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending email. Try again later', 500),
    );
  }
});

exports.resetPassword = catchAsync(async (req, resp, next) => {
  //1. get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpired: { $gt: Date.now() },
  });

  //2. set new possword if password not expired and there is user
  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  //3. update changed password for user

  //4. log the user in? send JWT
  createSendToken(user, 200, resp);
});

exports.updatePassword = catchAsync(async (req, resp, next) => {
  //1. get user from collection
  const user = await User.findById(req.user.id).select('+password');

  //2. Check if posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //3. If the password is correct - update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //4. login with the new password
  createSendToken(user, 200, resp);
});
