import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage';
import Grid from 'gridfs-stream';
import pkg from 'uuid';
import User from './models/user.js';
const { v4: uuidv4 } = pkg;

import userRoutes from './routes/users.js';

const app = express();

app.use(cors());
dotenv.config();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });

app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
const CONNECTION_URL = 'mongodb+srv://staffan5:test123@gettingstarted.hgzw7.mongodb.net/bandmatefinder?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5000;

//new login code
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log(username, password);

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
            else res.status(200).send({
                token: 'myAwesomeToken',
                user: username
              });
        })
    })
});

app.use('/users', userRoutes);

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }) //returns promise
    .then(() => app.listen(PORT, () => console.log(`server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);

function passwordsDontMatch(password, confirmPassword) {
    if(password !== confirmPassword){
        return true;
    } else {
        return false;
    }
}