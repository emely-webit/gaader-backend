const mongoose = require('mongoose');
let bcrypt = require('bcrypt');


const brugerSchema = new mongoose.Schema({
    brugernavn:{
        type: String,
        required: true,
        default: "John Doe"
    },
    email:{
        type: String,
        required: [true, 'Email is required!'], // Fejlbesked med direkte fra serveren
        trim: true,                             // Fjerner et mellemrum før eller efter email'en der bliver trukket ind
        lowercase: true,                        // Laver alt små bogstaver i email'en, så man ikke risikere at store bogstaver er gemt i databasen
        index: { unique: true}                  // Tjekker om email'en er korrekt
    },
    password:{
        type: String,
        required: [true, 'Password is required!'],
        minlength: [3, 'Password need to be longer!']
    }
})

// Krypter pw - når bruger-data gemmes hvis password er ændret/nyt 
brugerSchema.pre('save', async function (next) {
    const user = this;
    // hvis bruger er rettet men password ikke ændret så spring dette over ... next() betyder forlad denne middleware
    if (!user.isModified('password')) return next();
    //Lav nye password
    const hashedPassword = await bcrypt.hash(user.password, 10)
    //Erstat password med det krypterede password
    user.password = hashedPassword
    next()
});

module.exports = mongoose.model('BrugerFil', brugerSchema);