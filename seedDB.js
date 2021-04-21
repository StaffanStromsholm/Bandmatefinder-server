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

export default seedDB;