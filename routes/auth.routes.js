const express = require('express');
const router = express.Router();
const BrugerFil = require('../models/bruger.model');


/** LOGIN */

router.post('/login', async (req, res) => {

    // Gamle metode
    // const email = req.body.email;
    // const password = req.body.password
    // Nye metode
    const { email, password } = req.body;
    
    const bruger = await BrugerFil.findOne({ email: email });

    if(!bruger){
        return res.status(401).json({ message: "email findes ikke i systemet"});
    }

    if(email && password){

        // Tjekker om den indtastede password er det samme som det hashede password
        bruger.comparePassword(password, function(err, isMatch){

            // Hvis der er en fejl
            if(err) throw err;
            
            // Hvis den er rigtig
            if(isMatch){
                // Der bliver lavet en session til profilen
                req.session.userId = bruger._id;
                console.log("heeeeej", bruger.email)
                res.json({ email: bruger.email, brugerID: bruger._id});

            } else{

                res.status(401).clearCookie(process.env.SESS_NAME).json({ message: "2. bruger, email og/eller password findes ikke"});
            }
        });
    }
    // res.redirect('/login');

})



/** LOGOUT */

router.get('/logout', async (req, res) => {

    req.session.destroy(err => {
        if(err){
            // return res.redirect('/gaader');
            return res.status(500).json({message: "du er ikke logget ud"});
        }
        // Sletter cookien ved at logge ud
        res.clearCookie(process.env.SESS_NAME).status(200).json({message: 'Brugeren er logget ud'})
    })
})


/** LOGGEDIN - TESTER OM MAN ER LOGGET IND - er jeg logget ind? */

router.get('/loggedin', async (req, res) => {
    
    // Spørger om id'en er der i cookien = er den, så er du logget ind
    if(req.session.userId){
        // Beskeden hvis du er der
        return res.status(200).json({ message: 'Du er stadig logget ind' });
    } else{
        // Hvis du ikke er logget ind får man denne besked
        return res.status(401).json({ message: 'Login eksistere ikke eller er udløbet'});
    }
})


module.exports = router