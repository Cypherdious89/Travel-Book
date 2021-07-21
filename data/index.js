/* jshint esversion : 9 */
const mongoose = require('mongoose');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers');
const Location = require('../models/location');

mongoose.connect('mongodb://localhost:27017/travel-book', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=>{
    console.log('Datadase connected');
});

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async ()=> {
    await Location.deleteMany({});
    for(let i=0; i<50; i++){
        const random = Math.floor(Math.random() * 1000);
        const site = new Location({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random].city}, ${cities[random].state}`
        });
        await site.save();
    }
};

seedDB().then(()=> {
    mongoose.connection.close();
});