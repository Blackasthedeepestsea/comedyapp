const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Club = require('../models/club');


mongoose.connect('mongodb://localhost:27017/comedy-app');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Club.deleteMany({});
    for(let i = 0; i < 50; i++){
     const random1000 = Math.floor(Math.random() * 1000);
     const price = Math.floor(Math.random() * 20) + 10;
       const club = new Club({
           author: '621d4d861ceb14325669b2db',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/3291759',
            description: "lorem ipsume blah blah",
            price
        
        })
        await club.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});