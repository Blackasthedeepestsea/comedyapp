const Club = require('../models/club');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const clubs = await Club.find({});
    res.render('clubs/index', { clubs} );
}

module.exports.renderNewForm = (req, res) => {
    res.render('clubs/new');
}

module.exports.createClub = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.club.location,
        limit: 1
    }).send()
    const club = new Club(req.body.club); 
    club.geometry = geoData.body.features[0].geometry;
    club.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    club.author = req.user._id;
     await club.save();
     console.log(club);
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
    console.log(req.body);
    const club = await Club.findByIdAndUpdate(id, { ...req.body.club });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    club.images.push(...imgs);
    await club.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await club.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated club!');
    res.redirect(`/clubs/${club._id}`)
}

module.exports.deleteClub = async (req,res) => {
    const { id } = req.params;
    await Club.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted club!')
    res.redirect('/clubs');
}