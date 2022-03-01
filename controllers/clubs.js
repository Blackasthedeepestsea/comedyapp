const Club = require('../models/club');

module.exports.index = async (req, res) => {
    const clubs = await Club.find({});
    res.render('clubs/index', { clubs} )
}

module.exports.renderNewForm = (req, res) => {
    res.render('clubs/new');
}

module.exports.createClub = async (req, res, next) => {
    //if(!req.body.campground) throw new ExpressError('invalid club data', 400);
 
    const club = new Club(req.body.club); 
      club.author = req.user._id;
     await club.save();
     req.flash('success', 'successfully made a new club');
     res.redirect(`/clubs/${club._id}`) 
 }

 module.exports.showClub = async (req, res) => {
    const club = await Club.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
          path: 'author'
        }
    }).populate('author');

  if(!club) {
      req.flash('error', 'cant find that club');
      return res.redirect('/clubs');
  }
    res.render('clubs/show', { club });
  }

  module.exports.renderEdit = async (req,res) => {
    const { id } = req.params;
    const club = await Club.findById(id)
    if (!club) {
        req.flash('error', 'cant find that club!');
        return res.redirect('/clubs');
    }
   
    res.render('clubs/edit', { club });
}

module.exports.updateClub = async (req,res) => {
    const { id } = req.params;
   
   const club = await Club.findByIdAndUpdate(id,{...req.body.club});
    req.flash('success', 'successfully updated club');
    res.redirect(`/clubs/${club._id}`)
}

module.exports.deleteClub = async (req,res) => {
    const { id } = req.params;
    await Club.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted club!')
    res.redirect('/clubs');
}