const express = require('express'),
      app     = express();

const bodyParser = require('body-parser');

// Let app use ejs
app.set('view engine', 'ejs');

// Link static files
app.use(express.static('public'));

// parse application/x-www-form-urlencoded & application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    let today = new Date();
    let currentDay = today.getDay();
    let message = '';

    // Based of the day of the week
    if(currentDay === 0 || currentDay === 6) {
        message = 'yay its the weekend';
    } else {
        message = 'Boo, I have work!';
    }

    res.render('index', {message: message})
});

// SERVER
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server started on port:', port);
});