const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { log } = require('console');

const app = express();
const port = 3000;

var username;
app.use(express.static(__dirname));
const MONGODB_URI = 'mongodb+srv://Akilo_:123123123Dem@webtech.jwd7rme.mongodb.net/';
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
    });

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model('User', userSchema);

app.set('views', path.join(__dirname));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password }).exec();
        const isAdmin = user.isAdmin;
        if (user) {
            if (isAdmin == true) {
                res.redirect('/admin')
            } else {
                res.redirect('/app');
            }
        } else {
            res.send('Invalid username or password');
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username }).exec();
        if (existingUser) {
            res.status(400).send('Username already exists');
            return;
        }
        const newUser = new User({ username, password });
        await newUser.save();
        res.send('Registration successful');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/app', async (req, res) => {
    res.render('app');
})

app.get('/admin', async (req, res) => {
    try {
        const users = await User.find().exec();
        const weatherRequests = await WeatherData.find().exec();
        const nasaRequests = await NasaData.find().exec();
        const newsRequests = await NewsData.find().exec();
        res.render('admin', { users, weatherRequests, nasaRequests, newsRequests });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

const nasaDataSchema = new mongoose.Schema({
    data: Object,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const NasaData = mongoose.model('NasaData', nasaDataSchema);

const newsDataSchema = new mongoose.Schema({
    data: Object,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const NewsData = mongoose.model('NewsData', newsDataSchema);

module.exports = { NasaData, NewsData };

app.get('/getNasa', async (req, res) => {
    try {
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=O6oX0tGwcVPJCTtm74JCODQDPaxwupACXkee54sg');
        const newNasaData = await response.json();
        const savedNasaData = await NasaData.findOne({ "data.date": newNasaData.date }).exec();
        if (savedNasaData) {
            res.json(savedNasaData);
        } 
        else {
            const currentTime = new Date();
            const newSavedNasaData = await NasaData.create({ data: newNasaData, createdAt: currentTime });
            res.json(newSavedNasaData);
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/getNews', async (req, res) => {
    try {
        const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=9a0a6d42d6524e02a488a22466b31ac8');
        const newsData = await response.json();
        const savedNewsData = await NewsData.find().sort({ _id: -1 }).limit(1).exec();
        if (savedNewsData.length > 0) {
            if (JSON.stringify(savedNewsData[0].data) === JSON.stringify(newsData)) {
                res.json(savedNewsData[0]);
            } else {
                const currentTime = new Date();
                const newSavedNewsData = await NewsData.create({ data: newsData, createdAt: currentTime });
                res.json(newSavedNewsData);
            }
        } else {
            const newSavedNewsData = await NewsData.create({ data: newsData });
            res.json(newSavedNewsData);
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

const WeatherData = mongoose.model('WeatherData', new mongoose.Schema({
    city: String,
    data: Object,
    createdAt: {
        type: Date,
        default: Date.now
    }
}));

app.get('/getWeather', async (req, res) => {
    const city = req.query.city.toString();
    try {
        if (!city) {
            return res.status(400).json({ error: 'City parameter is required' });
        }
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=73cc03e98d83f14402b98544aea117e3`);
        const weatherData = await response.json();
        const currentTime = new Date();
        await WeatherData.create({ city, data: weatherData, createdAt: currentTime });

        const savedWeatherData = await WeatherData.findOne({ city }).exec();
        if (savedWeatherData) {
            res.json(savedWeatherData.data);
        } else {
            res.status(404).json({ error: 'Weather data not found' });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

app.get('/admin/delete-user/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/admin/add-user', async (req, res) => {
    try {
        const { username, password } = req.body;
        const isAdmin = req.body.isAdmin === 'on';
        const newUser = new User({
            username,
            password,
            isAdmin
        });
        await newUser.save();
        res.redirect('/admin');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/admin/edit-user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('edit-user', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/admin/edit-user/:id', async (req, res) => {
    try {
        const { username, password, isAdmin } = req.body;
        const updatedUser = {
            username,
            password,
            isAdmin
        };
        await User.findByIdAndUpdate(req.params.id, updatedUser);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});