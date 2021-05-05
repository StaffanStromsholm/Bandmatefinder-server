//modules
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/user.js';
import userRoutes from './routes/users.js';
import commentRoutes from './routes/comments.js'
import {seedDB} from './seeds/seedDB.js';

//variables
const app = express();
const CONNECTION_URL = process.env.ATLAS_URL;
const PORT = process.env.PORT || 5000;

//settings
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
dotenv.config();

//uncomment seedDB() to summon 100 new random users
// seedDB();

//login route and controller
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

//rest of the routes
app.use('/users', userRoutes);
app.use('/users/:id/comments', commentRoutes);

//connect to DB and start server
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);