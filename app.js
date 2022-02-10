const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Club = require('./models/club');

mongoose.connect('mongodb://localhost:27017/howlie');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected");
})

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req,res) => {
    res.render('home')
})
app.get('/makeclub', async (req,res) => {
   const club = new Club({title: 'Haha Zone', description: 'best club'});
   await club.save();
   res.send(club)
})

app.listen(3000, () => {
    console.log('SERVING ON PORT 3000')
})