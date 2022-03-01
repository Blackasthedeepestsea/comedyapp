const Club = require('../models/club');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const club = await Club.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    club.reviews.push(review);
   await review.save();
   await club.save();
   req.flash('success', 'created new review!');
   res.redirect(`/clubs/${club._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Club.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'successfully deleted review!');
    res.redirect(`/clubs/${id}`);
}