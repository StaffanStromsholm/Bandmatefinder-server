import express from 'express';
import mongoose from 'mongoose';
import nodeGeocoder from 'node-geocoder';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import User from '../models/user.js';

dotenv.config();

const router = express.Router();

let options = {
    provider: 'here',
    apiKey: process.env.GEOCODER_API_KEY
};

let geoCoder = nodeGeocoder(options);

//========== getUsers ============

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

//========== getUser ============

export const getUser = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).populate('comments');

        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

//========== createUser ============


export const createUser = async (req, res) => {
    const { username, password, confirmPassword, city, postalCode, primaryInstrument, skillLevel, lookingFor, freeText, email, mediaLink } = req.body;

    if ((!password || !confirmPassword) || password !== confirmPassword) {
        return res.status(400).json({ message: `password problem` })
    }

    const geoLocation = await getGeoLocation(city, postalCode);

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hashedPassword) => {
            const newUser = new User({
                // photo,
                username,
                password: hashedPassword,
                city,
                postalCode,
                geoLocation,
                primaryInstrument,
                skillLevel,
                lookingFor,
                freeText,
                mediaLink,
                email
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
}

//========== updateUser ============

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, city, postalCode, primaryInstrument, freeText, skillLevel, lookingFor } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${_id}`);

    const updatedUser = { id, username, city, postalCode, primaryInstrument, freeText, skillLevel, lookingFor, _id: id }
    
    let geoLocation;

    if (city) {
        geoLocation = await getGeoLocation(city);
        updatedUser.geoLocation = geoLocation;
    }

    await User.findByIdAndUpdate(id, updatedUser, { new: true })

    res.json({ updatedUser, message: 'update ok' });
}

export default router;

async function getGeoLocation(city, postalCode) {
    const geocodedLocation = await geoCoder.geocode(`${city} ${postalCode}`)
    return ({ latitude: geocodedLocation[0].latitude, longitude: geocodedLocation[0].longitude })
}