import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import validator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import localStrategy from 'passport-local';
import passportJWT from 'passport-jwt';
import dotenv from 'dotenv';
dotenv.config();


// import initializePassport from './passport-config.js';
// initializePassport(
//     passport,
//     email => users.find(user => user.email === email));

// import apiRouter from './routes/api.js';

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// app.use(flash());
// app.use(session({
//     session: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false
// }))

// app.use(passport.initialize());
// app.use(passport.session());

// app.use('/api', apiRouter)

const CONNECTION_URL = 'mongodb+srv://staffan5:test123@gettingstarted.hgzw7.mongodb.net/bandmatefinder?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5000;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    joined: {
        type: Date,
        default: new Date()
    },
    city: String,
    postalCode: String,
    primaryInstrument: String,
    otherInstruments: [String],
    genres: [String],
    skillLevel: String,
    lookingForBands: Boolean,
    lookingForPeopleToJamWith: Boolean,
    summary: String,
    gear: String,
    bands: [String],
    media: [String],
    email: String
})

userSchema.plugin(validator);

const User = mongoose.model('User', userSchema);

// seedDB();

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hashedPassword) => {
            const newUser = new User({
                username,
                password: hashedPassword
            });
            newUser.save()
                .then(() => {
                    console.log('registered new user')
                    res.status(200).send();
                })
                .catch(err => {
                    console.log('An error has occured while registering a new user')
                    res.status(500).send();
                })

            res.end();
        })
    })
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username }, (err, user) => {
        if (err) {
            console.log('an error has occured')
            res.status(500).send()
            return;
        }

        if (!user) {
            res.status(403).send();
            return;
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) res.status(500).send();
            if (!result) res.status(403).send();
            else res.status(200).send();
        })
    })
})

app.get('/getall', (req, res)=>{
    User.find({}, (err, users)=>{
        if(err) console.log(err);
        else res.json(users);
    })
})

app.get('/getuser/:username', (req, res) => {
    const username = req.params.username;
    User.findOne({username}, (err, user) => {
        if(err) console.log(err);
        res.json({user});
    })
})

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }) //returns promise
    .then(() => app.listen(PORT, () => console.log(`server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);