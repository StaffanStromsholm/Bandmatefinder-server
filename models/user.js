import mongoose from 'mongoose';

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
    email: String
})

userSchema.plugin(validator);

const User = mongoose.model('User', userSchema);

export default User;