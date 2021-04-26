import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import validator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

import nodeGeocoder from 'node-geocoder';

let options = {
    provider: 'here',
    apiKey: process.env.GEOCODER_API_KEY
};

let geoCoder = nodeGeocoder(options);
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
    },
    joined: {
        type: Date,
        default: new Date()
    },
    city: String,
    geoLocation: {
        latitude: Number,
        longitude: Number
    },
    postalCode: String,
    primaryInstrument: String,
    otherInstruments: [String],
    genres: [String],
    skillLevel: String,
    lookingFor: {
        bands: Boolean,
        jams: Boolean,
        studioWork: Boolean,
        songWriting: Boolean
    },
    freeText: String,
    gear: String,
    mediaLink: String,
    email: String
})

userSchema.plugin(validator);

const User = mongoose.model('User', userSchema);

const seedDB = () => {
    const newUser = new User({
        username: 'Harry',
        password: "somePassword",
        city: "Kokkola",
        postalCode: "",
        primaryInstrument: "Piano",
        otherInstruments: ["Drums", "Bass", "Guitar"],
        skillLevel: "Intermediate",
        lookingFor: {
            bands: true,
            jams: false,
            studioWork: true,
            songWriting: true
        },
        freeText: "I would like to start a heavy funk band! Wouldn't that be cool?",
        gear: "Piano and bench",
        bands: ["Band 1", "Pass the milk, please", "FunTimez"],
        mediaLink: "https://youtu.be/a2LFVWBmoiw",
        email: "mail.mail@mail.com"
    });
    newUser.save()

    const newUser2 = new User({
        username: 'Peter Frank',
        password: "aaaawesome",
        city: "Rovaniemi",
        postalCode: "",
        primaryInstrument: "Drums",
        otherInstruments: ["Contrabass"],
        skillLevel: "Rockstar",
        lookingFor: {
            bands: true,
            jams: true,
            studioWork: false,
            songWriting: false
        },
        freeText: "Life's too short to play bad solos",
        gear: "Drums and sticks",
        bands: ["Band 1", "Pass the milk, please", "FunTimez"],
        mediaLink: "https://youtu.be/px1C7h8Z_3c",
        email: "mail.mail@mail.com"
    });
    newUser2.save()

     const newUser3 = new User({
            username: 'Jessy Harris',
            password: "ksjhdf",
            city: "Helsinki",
            postalCode: "00570",
            primaryInstrument: "Bass",
            otherInstruments: ["Violin", "Trumpet", "Flute"],
            skillLevel: "Rockstar",
            lookingFor: {
                bands: true,
                jams: false,
                studioWork: true,
                songWriting: true
            },
            freeText: "I would like to start a heavy funk band! Wouldn't that be cool?",
            gear: "Fender Jazz Bass, Ampeg amplifier",
            bands: ["Band 1", "Pass the milk, please", "FunTimez"],
            mediaLink: "https://youtu.be/KYrdHW38IqA",
            email: "mail.mail@mail.com"
        });
        newUser3.save()
    
        const newUser4 = new User({
            username: 'Amy Parks',
            password: "oa09sd",
            city: "Espoo",
            postalCode: "",
            primaryInstrument: "Electric-guitar",
            otherInstruments: ["Drums", "Cello"],
            skillLevel: "Intermediate",
            lookingFor: {
                bands: true,
                jams: false,
                studioWork: true,
                songWriting: true
            },
            freeText: "How can less be more? More is more.",
            gear: "Telecaster, Fender Twin Reverb",
            bands: ["Band 1", "Pass the milk, please", "FunTimez"],
            mediaLink: "https://youtu.be/KYrdHW38IqA",
            email: "mail.mail@mail.com"
        });
        newUser4.save()
}

// seedDB();

app.post('/register', async(req, res) => {
    const { username, password, confirmPassword, city, primaryInstrument, skillLevel, lookingFor, freeText } = req.body;

    if(passwordsDontMatch(password, confirmPassword)){
        return res.status(400).send(`passwords don't match`)
    }

    const geocodedLocation = await geoCoder.geocode(`${city}`)
    console.log(geocodedLocation);

    const geoLocation = {latitude: geocodedLocation[0].latitude, longitude: geocodedLocation[0].longitude}

    console.log(geoLocation);

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hashedPassword) => {
            const newUser = new User({
                username,
                password: hashedPassword,
                confirmPassword,
                city,
                geoLocation,
                primaryInstrument,
                skillLevel,
                lookingFor,
                freeText
            });
            newUser.save()
                .then(() => {
                    return res.status(200).send(`new User registered`);
                })
                .catch(err => {
                    return res.status(500).send(`An error occured while registering a new user`);
                })
        })
    })
})

//new login code
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
            else res.status(200).send({
                token: 'myAwesomeToken',
                user: username
              });
        })
    })
});

app.get('/getall', (req, res)=>{
    User.find({}, (err, users)=>{
        if(err) console.log(err);
        else res.json(users);
    })
})

app.get('/getuser/:username', (req, res) => {
    const { username } = req.params;
    User.findOne({username}, (err, user) => {
        if(err) console.log(err);
        res.json({user});
    })
})

app.patch('/user/:id', async(req, res) => {
    const { id } = req.params;
    const { username, password, city, postalCode, primaryInstrument, freeText, skillLevel, lookingFor } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${_id}`);

    const updatedUser = {id, username, password, city, postalCode, primaryInstrument, freeText, skillLevel, lookingFor, _id: id}
    await User.findByIdAndUpdate(id, updatedUser, { new: true })

    res.json({updatedUser, message: 'update ok'});
})

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