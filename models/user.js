import mongoose from 'mongoose';
import validator from 'mongoose-unique-validator';


const userSchema = new mongoose.Schema({
    photo: {
        type: String
    },
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
    email: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
})

userSchema.plugin(validator);

const User = mongoose.model('User', userSchema);

export default User;