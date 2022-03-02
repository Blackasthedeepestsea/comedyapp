const express = require('express');
const router = express.Router();
const clubs = require('../controllers/clubs');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateClub} = require('../middleware');
const Club = require('../models/club');
const multer = require('multer');
const upload = multer({ dest: 'uploads/'})




router.route('/')
    .get(catchAsync(clubs.index))
    //.post(isLoggedIn, validateClub, catchAsync(clubs.createClub))
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files);
        res.send('it worked...');
    })

router.get('/new', isLoggedIn, clubs.renderNewForm);

router.route('/:id')
    .get(catchAsync(clubs.showClub))
    .put(isLoggedIn, isAuthor, validateClub, catchAsync(clubs.updateClub))
    .delete(isLoggedIn, isAuthor, catchAsync(clubs.deleteClub))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(clubs.renderEdit));


module.exports = router;