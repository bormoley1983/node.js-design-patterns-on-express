const mongoose = require('mongoose');
//const slugify = require('slugify');
//const Tour = require("./tourModel")

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review cannot be empty'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A review name must have less or equal then 40 characters',
      ],
      minlength: [
        10,
        'A review name must have more or equal then 10 characters',
      ],
      //validate: [validator.isAlpha, 'Name is not alpha'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'A review must have a rating'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to the tour.'],
      },
    ],
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must be connected to user.'],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'Tour',
    //select: '-__v -passwordChangedAt',
  });

  next();
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'User',
    select: '-__v -passwordChangedAt',
  });

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

//review
//rating
//createdAt
//reference to the Tour
//reference to URLSearchParams
