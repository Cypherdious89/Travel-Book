/* jshint esversion : 9 */
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Location = require('./models/location');

mongoose.connect('mongodb://localhost:27017/travel-book', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
mongoose.set('useNewUrlParser', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=>{
    console.log('Datadase connected');
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//HOME ROUTE
app.get('/', (req, res) => {
    res.render('home');
});

// MAIN ROUTE
app.get('/sites', async (req, res) => {
    const sites = await Location.find({});
    res.render('places/index', {sites});
});

// NEW ROUTES
app.get('/sites/new', (req, res) => {
    res.render('places/new');
});

app.post('/sites', async(req, res) =>{
    const site = new Location(req.body.site);
    await site.save();
    res.redirect(`/sites/${site._id}`);
});

// SHOW ROUTE
app.get('/sites/:id', async (req, res) => {
    const site = await Location.findById(req.params.id);
    res.render('places/show', {site});
});

// EDIT ROUTE
app.get('/sites/:id/edit', async (req, res)=>{
    const site = await Location.findById(req.params.id);
    res.render('places/edit', {site});
});

app.put('/sites/:id', async (req, res)=>{
    const {id} = req.params;
    const site = await Location.findByIdAndUpdate(id, {...req.body.site});
    res.redirect(`/sites/${site._id}`);
});

//DELETE ROUTE
app.delete('/sites/:id', async (req, res)=>{
    const {id} = req.params;
    await Location.findByIdAndDelete(id);
    res.redirect('/sites');
});

// DEFAULT ROUTE
app.get('*', (req, res) => {
    res.send('ERR:404. Page not found !!!');
});

app.listen('3000', ()=>{
    console.log('listening to port 3000');
});