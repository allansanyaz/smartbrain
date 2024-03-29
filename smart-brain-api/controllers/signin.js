const jwt = require('jsonwebtoken');
const redisClient = require('../redis/redis').redisClient;

const handleSignin = (knex, bcrypt, req, res) => {
    const { email, password } = req.body;
    if(!email || !password) return Promise.reject('Incorrect form submission');

    // to use req.body we need to use body-parser
    // check the email and password against the database
    return knex.select('email', 'hash').from('login').where('email', '=', req.body.email)
    .then(data => {
        return bcrypt.compare(req.body.password, data[0].hash).then(result => {
            if(result) {
                return knex.select('*').from('users').where('email', '=', req.body.email)
                .then(user => user[0])
                .catch(err => Promise.reject('Unable to get user'));
            } else {
                return Promise.reject('Wrong credentials');
            }
        });
    })
    .catch(err => {
        console.log(err);
        return Promise.reject('Wrong user or password combination');
    });
}

const getAuthTokenId = async(req, res) => {
    const { authorization } = req.headers;
    return await redisClient.get(authorization, (err, reply) => {
        if(err || !reply) {
            return res.status(401).json('Unauthorized');
        } else {
            return res.json({id: reply});
        }
    });
}

const signToken = (email) => {
    const jwtPayload = { email }; 
    return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '7 days' });
}

const setToken = (key, value) => {
    const redisPromise = Promise.resolve(redisClient.set(key, value));
    // set an expiration for the key in the redis database
    redisClient.expire(key, 7 * 24 * 60 * 60);
    // return the promise
    return redisPromise;
}

const createSessions = (user) => {
    // create JWT token and return user data
    const { email, id } = user;
    const token = signToken(email);

    return setToken(token, id)
        .then(() => ({'success': true, 'id': id, token}))
        .catch(err => console.log(err));
}

const signInAuthentication = (knex, bcrypt) => (req, res) => {
    const { authorization } = req.headers;
    return authorization ? 
        getAuthTokenId(req, res) : 
        handleSignin(knex, bcrypt, req, res)
            .then(data =>  {
                return data.id && data.email ? createSessions(data) : Promise.reject(data);
            })
            .then(session => res.json(session))
            .catch(err => {
                console.log(err);
                return res.status(400).json("Wrong user or password combination")
            });
}

module.exports = {
    signInAuthentication: signInAuthentication,
    createSessions: createSessions
}