const express = require('express');
const router = express.Router();
const BrugerFil = require('../models/bruger.model');


/** LOGIN */

router.post('/login', async (req, res) => {

    const { email, password } = req.body;
    
    const bruger = await BrugerFil.findOne({ email: email });
    if(email && password){
        bruger.comparePassword(password, function(err, isMatch){

            if(err) throw err;
            console.log('Password ', isMatch);

            if(isMatch){
                req.session.userId = bruger._id;
                console.log("heeeeej", bruger.email)
                res.json({ email: bruger.email, brugerID: bruger._id});
            } else{
                res.status(401).clearCookie(process.env.SESS_NAME).json({ message: "2. bruger, email og/eller password findes ikke"});
                // res.status(401)
            }
        });
    }
    // res.redirect('/login');

})



/** LOGOUT */

router.get('/logout', async (req, res) => {

    req.session.destroy(err => {
        if(err){
            return res.redirect('/gaader');
        }

        res.clearCookie(process.env.SESS_NAME);
        res.status(200).send({message: 'Brugeren er logget ud'})
    })
})


/** LOGGEDIN - TESTER OM MAN ER LOGGET IND */

router.get('/loggedin', async (req, res) => {

})


module.exports = router