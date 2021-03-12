'use strict';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import validator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());


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
    }
})

userSchema.plugin(validator);

const User = mongoose.model('User', userSchema);

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
            if(err) res.status(500).send();
            if(!result) res.status(403).send();
            else res.status(200).send();
        })
    })
})

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }) //returns promise
    .then(() => app.listen(PORT, () => console.log(`server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));


mongoose.set('useFindAndModify', false);