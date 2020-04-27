// Setup
const express = require('express'),
    app = express();

const mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      _ = require('lodash');

// Linking environment variables
require('dotenv').config();

// Connecting Mongo Database
const LOCAL_URL = `mongodb://localhost/${process.env.DB_NAME}`;
      ATLAS_URL = `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@cluster0-xk65r.mongodb.net/${process.env.DB_NAME}`

mongoose.connect(ATLAS_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// Database Models
const Item = require('./models/Item').model;
const List = require('./models/List');

// Let app use ejs
app.set('view engine', 'ejs');

// Link static files
app.use(express.static('public'));

// parse application/x-www-form-urlencoded & application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Starter Items
const item1 = new Item({ name: 'Welcome to your todo list!' });
const item2 = new Item({ name: '<-- Check to remove item.' });

const defaultItems = [item1, item2];

// Routes
app.get('/', (req, res) => {
    // Find all entries in the database
    Item.find((err, items) => {
        if (err) { console.log(err) }
        else {
            res.render('list', { listTitle: "Today", items: items });
        }
    });
});

app.get('/:todoListName', (req, res) => {
    const todoListName = _.capitalize(req.params.todoListName);

    // Directs user to the correct todo list
    List.findOne({ name: todoListName }, (err, foundList) => {
        if (err) { console.log(err) }
        else {
            if (!foundList) {
                console.log(`Creating a new list: ${todoListName}`);

                // Creates new list
                const list = new List({
                    name: todoListName,
                    items: defaultItems
                });
                list.save();

                // Redirects to newly created todo list
                res.redirect('/' + todoListName);
            } else {
                // Show an existing list
                res.render('list', { listTitle: foundList.name, items: foundList.items });
            }
        }
    });
});

// Adds todo item to specific list in database
app.post('/', (req, res) => {
    const itemName = req.body.todoItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === 'Today') {
        // Add to main list
        item.save();
        res.redirect('/');
    } else {
        List.findOne({name: listName}, (err, foundList) => {
            if (err) { console.log(err) }
            else {
                foundList.items.push(item);
                foundList.save();
                res.redirect('/' + listName);
            }
        });
    }
});

// Deletes checked item from database
app.post('/delete', (req, res) => {
    const checkedItemID = req.body.delete;
    const listName = req.body.listName;

    if(listName === "Today") {
        Item.deleteOne({ _id: checkedItemID }, (err, deletedItem) => {
            if (err) { console.log('There was an error deleting the item.\n', err) }
            else {
                console.log('Item deleted:', deletedItem);
                res.redirect('/');
            }
        });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemID}}}, (err, foundList) => {
            if (err) { console.log(err) }
            else {
                console.log(foundList);
                
                // foundList.items.pull({_id: item});
                res.redirect('/' + listName);
            }
        })
    }
});

// SERVER
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server started on port:', port);
});