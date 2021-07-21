/* jshint esversion : 9 */
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Location = require('./models/location');

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

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/add-location', async (req, res) => {
    const site = new Location({title: 'Red Fort', location: 'Delhi'});
    await site.save();
    res.send(site);
});

app.listen('3000', ()=>{
    console.log('listening to port 3000');
});