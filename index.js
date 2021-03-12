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
    },
    postalCode: String,
    instrument: String,
    skillLevel: String,
    lookingForBands: Boolean,
    lookingForPeopleToJamWith: Boolean,
    otherInfo: String,
    gear: String,
    bands: [String],
    media: [String],
    email: String
})

userSchema.plugin(validator);

const User = mongoose.model('User', userSchema);

// ===================

const seedDB = () => {
    const newUser = new User({
        username: 'Miles Davis',
        password: "someKindOfBlue",
        postalCode: "00570",
        instrument: "Trombone",
        skillLevel: "Beginner",
        lookingForBands: true,
        lookingForPeopleToJamWith: true,
        otherInfo: "I really like dogs",
        gear: "Trombone, notestand",
        bands: ["the Immortalities", "You again?", "Badweiser"],
        media: ["url1", "url2", "url3"],
        email: "miles.trombone@jazz.com"
    });
    newUser.save()

    const newUser2 = new User({
        username: 'Bill Haley',
        password: "somePass",
        postalCode: "00251",
        instrument: "Xylophone",
        skillLevel: "Rockstar",
        lookingForBands: true,
        lookingForPeopleToJamWith: false,
        otherInfo: "I really like cats",
        gear: "Xylophone, mallets",
        bands: ["the Commandoes", "Why!", "The Badds"],
        media: ["url1", "url2", "url3"],
        email: "bill.halo@rock.fi"
    });
    newUser2.save()
}

// seedDB();

// ===================

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