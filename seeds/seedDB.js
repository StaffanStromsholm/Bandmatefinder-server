import User from '../models/user.js';
import axios from 'axios';
import {instruments} from './instruments.js';
import {finnishCities} from './finnishCities.js';
import { skillLevels, lookingForArray } from './constants.js';
import nodeGeocoder from 'node-geocoder';

let options = {
    provider: 'here',
    apiKey: process.env.GEOCODER_API_KEY
};

let geoCoder = nodeGeocoder(options);

export const seedDB = async() => {

//get 100 random users from https://randomuser.me
    const response = await axios.get('https://randomuser.me/api/?results=100&nat=fi');
    const randomUsers = response.data.results;
    const freeText = "Put a bird on it bespoke green juice +1 austin cliche art party. Microdosing fam coloring book lyft sartorial crucifix. Selvage pug locavore kitsch bitters meh YOLO kickstarter vape single-origin coffee. Photo booth hashtag hammock kale chips distillery. Succulents before they sold out cloud bread, trust fund jean shorts intelligentsia la croix cray hot chicken offal single-origin coffee whatever shabby chic. Kombucha letterpress yuccie cold-pressed street art. Edison bulb hashtag mustache kombucha hell of vice, everyday carry salvia snackwave +1 mixtape tote bag twee DIY actually. Kogi snackwave art party forage distillery direct trade shoreditch."
    
    randomUsers.forEach(async(user) => {
        let randomIntsumentNr = Math.floor(Math.random() * 16);
        let randomLookingFor = Math.floor(Math.random() * 10);
        let randomSkillNr = Math.floor(Math.random() * 4);

        const city = user.location.city

        const geoLocation = await getGeoLocation(city);

        let newUserInfo = {
            username: user.login.username,
            password: user.login.password,
            city,
            postalCode: user.location.postcode,
            geoLocation,
            primaryInstrument: instruments[randomIntsumentNr],
            skillLevel: skillLevels[randomSkillNr],
            lookingFor: lookingForArray[randomLookingFor],
            freeText,
            email: user.email
        }

        console.log(newUserInfo);

        const newUser = new User(newUserInfo)

        newUser.save()
    });
}

async function getGeoLocation(city) {
    const geocodedLocation = await geoCoder.geocode(`${city}`)
    return ({ latitude: geocodedLocation[0].latitude, longitude: geocodedLocation[0].longitude })
}