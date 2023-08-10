const express = require('express');
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

// define the PORT from the env file
const PORT = process.env.PORT || 3001;

// the set up of the database here
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : process.env.DATABASE_HOST,
      port : process.env.DATABASE_PORT,
      user : process.env.DATABASE_USER,
      password : process.env.DATABASE_PASSWORD,
      database : process.env.DATABASE_NAME
    }
  });
  
// build the express application
const app = express();
app.use(bodyParser.json());
app.use(cors());

// these are request and response objects
// don't forget that this is the server and therefore postman is the client
// we are sending information to the client
app.get('/', (req, res) => res.send("Success"));

app.post('/signin', (req, res) => signin.handleSignin(req, res, knex, bcrypt));

app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, knex));

app.post('/register', (req, res) => register.handleRegister(req, res, knex, bcrypt));

app.put('/image', (req, res) => image.handleImage(req, res, knex));

// this also tells us the port that our server is listening on
app.listen(PORT, () => {
    console.log(`I am listening on port ${PORT}`);
});

