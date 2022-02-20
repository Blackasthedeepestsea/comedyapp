const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Club = require('./models/club');
const res = require('express/lib/response');

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

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/clubs', async (req, res) => {
    const clubs = await Club.find({});
    res.render('clubs/index', { clubs })
});

app.get('/clubs/new', async (req, res) => {
    res.render('clubs/new');
})

app.post('/clubs', async (req, res) => {
    const club = new Club(req.body.club);
    await club.save();
    res.redirect(`/clubs/${club._id}`)
})

app.get('/clubs/:id', async (req, res) => {
  const club = await Club.findById(req.params.id)
    res.render('clubs/show', { club });
});

app.get('/clubs/:id/edit', async(req,res) => {
    const club = await Club.findById(req.params.id)
    res.render('clubs/edit', { club });
});

app.put('/clubs/:id', async (req,res) => {
    const { id } = req.params;
    const club = await Club.findByIdAndUpdate(id,{...req.body.club});
    res.redirect(`/clubs/${club._id}`)
})

app.delete('/clubs/:id', async (req,res) => {
    const { id } = req.params;
    await Club.findByIdAndDelete(id);
    res.redirect('/clubs/');
})

app.listen(3000, () => {
    console.log('SERVING ON PORT 3000')
})