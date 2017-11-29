const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;
const port = 3000;
const app = express();

/*Middleware
const logger = function(req, res, next) {
    console.log('Logging...');
    next();
}

app.use(logger);*/

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//express Validator middleware
app.use(expressValidator());

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Set static path
app.use(express.static(path.join(__dirname, 'public')));

//Global vars
app.use(function(req, res, next) {
    res.locals.errors = null;
    next();
})

/*var people = [{
        name: 'Jeff',
        age: 30
    },
    {
        name: 'Sara',
        age: 22
    },
    {
        name: 'Bill',
        age: 34
    }
]*/

/*var users = [{
        id: 1,
        firstname: 'Davor',
        lastname: 'Mihajleski',
        email: 'davormihajleski@gmail.com',
    },
    {
        id: 2,
        firstname: 'Kiko',
        lastname: 'Stefano',
        email: 'someemail@gmail.com',
    },
    {
        id: 3,
        firstname: 'John',
        lastname: 'Doe',
        email: 'johndoe@gmail.com',
    }
]*/


app.get('/', (req, res) => {
    db.users.find(function(err, docs) {
        // docs is an array of all the documents in mycollection
        console.log(docs);

        res.render('index', {
            title: 'Customers',
            users: docs
        });
    });
});

app.post('/users/add', (req, res) => {

    req.checkBody('firstname', 'First name is required').notEmpty();
    req.checkBody('lastname', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('index', {
            title: 'Customers',
            users: users,
            errors: errors
        });
    } else {
        var newUser = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        }
        db.users.insert(newUser, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/');
            }
        });
    }
    //req.body.firstname ja zema vrednosta od name html attributot


    console.log(newUser);
});

app.delete('/users/delete/:id', (req, res) => {
    db.users.remove({ _id: ObjectId(req.params.id) }, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
})

app.listen(port, () => {
    console.log('server started on port ' + port);
});