const {clubSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Club = require('./models/club');
const Review = require('./models/review');

module.exports.isLoggedIn= (req, res, next) => {
   //console.log(req.path, req.originalUrl);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you must be signed in');
       return res.redirect('/login');
    }
    next();
}


module.exports.validateClub = (req, res, next) => {
    const {error} = clubSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const club = await Club.findById(id);
    if(!club.author.equals(req.user._id)){
        req.flash('error', 'you do not have permission to do that');
       return res.redirect(`/clubs/${id}`);
} next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/clubs/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

