const express = require('express');
const router = express.Router({ mergeParams: true});
const res = require('express/lib/response');
const { nextTick } = require('process');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const Club = require('../models/club');
const { reviewSchema } = require('../schemas.js');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const club = await Club.findById(req.params.id);
    const review = new Review(req.body.review);
    club.reviews.push(review);
   await review.save();
   await club.save();
   res.redirect(`/clubs/${club._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Club.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/clubs/${id}`);
}));

module.exports = router;