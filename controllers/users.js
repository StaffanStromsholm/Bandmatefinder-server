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
        const user = await User.findOne({ username })

        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

//========== createUser ============


export const createUser = async (req, res) => {
    const { username, password, confirmPassword, city, primaryInstrument, skillLevel, lookingFor, freeText } = req.body;

    if ((!password || !confirmPassword) || password !== confirmPassword) {
        return res.status(400).json({ message: `password problem` })
    }

    const geoLocation = await getGeoLocation(city);

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hashedPassword) => {
            const newUser = new User({
                // photo,
                username,
                password: hashedPassword,
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
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, city, postalCode, primaryInstrument, freeText, skillLevel, lookingFor } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${_id}`);

    const updatedUser = { id, username, password, city, postalCode, primaryInstrument, freeText, skillLevel, lookingFor, _id: id }
    
    let geoLocation;

    if (city) {
        geoLocation = await getGeoLocation(city);
        updatedUser.geoLocation = geoLocation;
    }

    await User.findByIdAndUpdate(id, updatedUser, { new: true })

    res.json({ updatedUser, message: 'update ok' });
    //     const { id } = req.params;
    //     const { username, password, city, postalCode, primaryInstrument, freeText, skillLevel, lookingFor } = req.body;

    //     if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${id}`);

    //     // if((!password || !confirmPassword) || password !== confirmPassword ){
    //     //     return res.status(400).json({message: `password problem`})
    //     // }

    //     let geoLocation;

    //     if(city) {
    //     geoLocation = await getGeoLocation(city);
    // }


    //     // const updatedUser = { username, password, city, postalCode, primaryInstrument, freeText, skillLevel, lookingFor}

    //     bcrypt.genSalt(10, (err, salt) => {
    //         bcrypt.hash(password, salt, (err, hashedPassword) => {
    //             const updatedUser = new User({
    //                 // photo,
    //                 username,
    //                 password: hashedPassword,
    //                 city,
    //                 geoLocation,
    //                 primaryInstrument,
    //                 skillLevel,
    //                 lookingFor,
    //                 freeText
    //             });
    //             User.findByIdAndUpdate(id, updatedUser, () => res.json({updatedUser, message: 'update ok'}))
    //         })
    //     })
}



// upload.single('photo'),



export default router;

async function getGeoLocation(city) {
    const geocodedLocation = await geoCoder.geocode(`${city}`)
    return ({ latitude: geocodedLocation[0].latitude, longitude: geocodedLocation[0].longitude })
}