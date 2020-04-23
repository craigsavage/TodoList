const express = require('express'),
      app     = express();

const bodyParser = require('body-parser');

// Variables
let items = [];

// Let app use ejs
app.set('view engine', 'ejs');

// Link static files
app.use(express.static('public'));

// parse application/x-www-form-urlencoded & application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    let today = new Date();

    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }

    let todaysDate = today.toLocaleDateString("en-US", options);
    console.log(`Today's date: ${todaysDate}`);

    res.render('list', {todaysDate: todaysDate, items: items});
});

app.post('/', (req, res) => {
    items.push(req.body.todoItem);
    console.log(items);
    res.redirect('/');
});

// SERVER
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server started on port:', port);
});