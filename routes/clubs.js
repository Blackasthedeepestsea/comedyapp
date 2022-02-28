const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {clubSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const Club = require('../models/club');

const validateClub = (req, res, next) => {
    const {error} = clubSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.get('/', catchAsync(async (req, res) => {
    const clubs = await Club.find({});
    res.render('clubs/index', { clubs })
}));

router.get('/new', catchAsync(async (req, res) => {
    res.render('clubs/new');
}))

router.post('/', validateClub, catchAsync(async (req, res, next) => {
   //if(!req.body.campground) throw new ExpressError('invalid club data', 400);

   const club = new Club(req.body.club);
    await club.save();
    req.flash('success', 'successfully made a new club');
    res.redirect(`/clubs/${club._id}`) 
}))

router.get('/:id', catchAsync(async (req, res) => {
  const club = await Club.findById(req.params.id).populate('reviews');

  res.render('clubs/show', { club });
}));

router.get('/:id/edit', catchAsync(async(req,res) => {
    const club = await Club.findById(req.params.id)
    res.render('clubs/edit', { club });
}));

router.put('/:id', validateClub, catchAsync(async (req,res) => {
    const { id } = req.params;
    const club = await Club.findByIdAndUpdate(id,{...req.body.club});
    res.redirect(`/clubs/${club._id}`)
}))

router.delete('/:id', catchAsync(async (req,res) => {
    const { id } = req.params;
    await Club.findByIdAndDelete(id);
    res.redirect('/clubs/');
}))

module.exports = router;