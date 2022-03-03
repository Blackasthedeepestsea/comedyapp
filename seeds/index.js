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
            images:  [
                {
                  url: 'https://res.cloudinary.com/dy7nkdujd/image/upload/v1646191651/ComedyApp/xby21oqes0bwx3sctj9a.jpg',
                  filename: 'ComedyApp/xby21oqes0bwx3sctj9a'
                },
                {
                  url: 'https://res.cloudinary.com/dy7nkdujd/image/upload/v1646191651/ComedyApp/bqa0eac8v9daczhqy4d2.jpg',
                  filename: 'ComedyApp/bqa0eac8v9daczhqy4d2'
                },
                {
                  url: 'https://res.cloudinary.com/dy7nkdujd/image/upload/v1646191651/ComedyApp/tiadznuwqkhxuqmqisxi.jpg',
                  filename: 'ComedyApp/tiadznuwqkhxuqmqisxi'
                }
              ],
            description: "lorem ipsume blah blah",
            price,
            geometry: {
              type: "Point",
              coordinates: [
                  cities[random1000].longitude,
                  cities[random1000].latitude,
              ]
          }
        
        })
        await club.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});