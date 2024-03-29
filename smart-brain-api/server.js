const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');

// require the dotenv package
require('dotenv').config();

// custom functions
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const imageURL = require('./controllers/imageURL');
const signout = require('./controllers/signout');
const auth = require('./middleware/authorization');

// define the PORT from the env file
const PORT = process.env.PORT || 3001;

// the set up of the database here
const knex = require('knex')({
    client: 'pg',
    connection: process.env.POSTGRES_URI
  });
  
// build the express application
const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

// these are request and response objects
// don't forget that this is the server and therefore postman is the client
// we are sending information to the client
app.get('/', (req, res) => res.send("Success"));
// app.post('/signin', signin.handleSignin(knex, bcrypt));
app.post('/signin', signin.signInAuthentication(knex, bcrypt));
app.post('/register', (req, res) => register.handleRegister(req, res, knex, bcrypt));
app.get('/profile/:id', auth.requireAuth, (req, res) => profile.handleProfileGet(req, res, knex));
app.post('/profile/:id', auth.requireAuth, (req, res) => profile.handleProfileUpdate(req, res, knex));
app.put('/image', auth.requireAuth, (req, res) => image.handleImage(req, res, knex));
app.post('/imageurl', auth.requireAuth, (req, res) => imageURL.handleImageURL(req, res));
app.post('/signout', auth.requireAuth, (req, res) => signout.handleSignout(req, res));

// this also tells us the port that our server is listening on
app.listen(PORT, () => {
    console.log(`I am listening on port ${PORT}`);
});

