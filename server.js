require('dotenv').config();

const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT;

const session = require('express-session');

/** MONGO DB */
const MongoStore = require('connect-mongo')(session);

const TWO_HOURS = 1000 * 60 * 60 *2;

// const {
//     NODE_ENV = 'development',
//     SESS_NAME = 'sid',
//     SESS_SECRET = 'ssh!quiet,it\'asecret!',
//     SESS_LIFETIME = TWO_HOURS
// } = process.env

const IN_PROD = process.env.NODE_ENV === 'production'

/** CONNECTION TIL MONGO DB*/
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log("Connected to database"));

/** APP */
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

/** HER SKAL SESSION VÆRE */

// var FileStore = require('session-file-store')(session);
 
// var fileStoreOptions = {};

// Denne skal kun være der når koden skal op og ligge på heruko
// app.set('trust proxy', 1)

app.use(session({
    name: process.env.SESS_NAME,
    // Denne skal bruges hvis man vil bruge session-file-store
    // store: new FileStore(fileStoreOptions),
    // Hvis man skal bruge mongo
    store: new MongoStore({ mongooseConnection: db }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: TWO_HOURS,
        sameSite: true, // can also be 'strict'
        secure: IN_PROD
    }
}))

/** TJEK OM MAN HAR ADGANG TIL AT ÆNDRE, SLETTE OG OPRETTE GÅDER - GØRES VIA ADMIN */
app.use('*/admin', (req, res, next) => {
    
    // Her tester den - hvis IKKE der er en session (man er logget ind), så får man en 401 fejl.
    if(!req.session.userId){

        return res.status(401).json({ message: "Du har ikke adgang - du skal være logget ind" });
    }
    // Hvis man så var logget ind, går den videre til næste function også kan man fortsætte med det man er igang med.
    next();
})

/** ROUTER */

// GÅDER http://localhost:5024/gaader
const gaaderRouter = require('./routes/gaader.routes');
app.use('/gaader', gaaderRouter);

// BRUGER http://localhost:5024/bruger
const brugerRouter = require('./routes/bruger.routes');
app.use('/admin/bruger', brugerRouter);

// AUTH http://localhost:5024/auth
const authRouter = require('./routes/auth.routes');
app.use('/auth', authRouter);

/**STARTER SERVEREN */
app.listen(PORT, () => console.log("server started on port http://localhost:"+PORT));