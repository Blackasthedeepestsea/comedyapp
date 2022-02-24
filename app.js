const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {clubSchema} = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Club = require('./models/club');
const res = require('express/lib/response');
const { nextTick } = require('process');

mongoose.connect('mongodb://localhost:27017/comedy-app');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected");
})

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

const validateClub = (req, res, next) => {
    const {error} = clubSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/clubs', catchAsync(async (req, res) => {
    const clubs = await Club.find({});
    res.render('clubs/index', { clubs })
}));

app.get('/clubs/new', catchAsync(async (req, res) => {
    res.render('clubs/new');
}))

app.post('/clubs', validateClub, catchAsync(async (req, res, next) => {
   //if(!req.body.campground) throw new ExpressError('invalid club data', 400);

   const club = new Club(req.body.club);
    await club.save();
    res.redirect(`/clubs/${club._id}`) 
}))

app.get('/clubs/:id', catchAsync(async (req, res) => {
  const club = await Club.findById(req.params.id)
    res.render('clubs/show', { club });
}));

app.get('/clubs/:id/edit', catchAsync(async(req,res) => {
    const club = await Club.findById(req.params.id)
    res.render('clubs/edit', { club });
}));

app.put('/clubs/:id', validateClub, catchAsync(async (req,res) => {
    const { id } = req.params;
    const club = await Club.findByIdAndUpdate(id,{...req.body.club});
    res.redirect(`/clubs/${club._id}`)
}))

app.delete('/clubs/:id', catchAsync(async (req,res) => {
    const { id } = req.params;
    await Club.findByIdAndDelete(id);
    res.redirect('/clubs/');
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'oh no, something went wrong'
   res.status(statusCode).render('error', { err });
 
})
app.listen(3000, () => {
    console.log('SERVING ON PORT 3000')
})