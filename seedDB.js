const seedDB = () => {
    const newUser = new User({
        username: 'Harry',
        password: "somePassword",
        city: "Kokkola",
        postalCode: "",
        primaryInstrument: "Piano",
        otherInstruments: ["Drums", "Bass", "Guitar"],
        skillLevel: "Intermediate",
        lookingForBands: true,
        lookingForPeopleToJamWith: true,
        summary: "I would like to start a heavy funk band! Wouldn't that be cool?",
        gear: "Piano and bench",
        bands: ["Band 1", "Pass the milk, please", "FunTimez"],
        media: ["url1", "url2", "url3"],
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
        lookingForBands: true,
        lookingForPeopleToJamWith: true,
        summary: "Should we start a band?",
        gear: "Drums and sticks",
        bands: ["Buffalo Soldiers", "Hey, honey", "HR-department"],
        media: ["url1", "url2", "url3"],
        email: "mail.mail@mail.fi"
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
            lookingForBands: true,
            lookingForPeopleToJamWith: true,
            summary: "I reaaally like 80's music.",
            gear: "Fender Jazz Bass",
            bands: ["The Rocketeers"],
            media: ["url1", "url2", "url3"],
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
            lookingForBands: true,
            lookingForPeopleToJamWith: true,
            summary: "I like Big Bands and i cannot lie.",
            gear: "Telecaster",
            bands: ["The Picks", "The Hits", "The Sticks"],
            media: ["url1", "url2", "url3"],
            email: "mail.mail@mail.fi"
        });
        newUser4.save()
}

module.exports = seedDB;