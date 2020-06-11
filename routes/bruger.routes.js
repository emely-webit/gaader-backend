const express = require('express');
const router = express.Router();
const BrugerFil = require('../models/bruger.model');

// Router til at få alle bruger
router.get('/admin', async (req, res) => {
    try{

        const brugere = await BrugerFil.find();
        res.json(brugere);

    } catch(error){

        res.status(500).json({message: error.message});
    }
})

// Router til at få en enkelt bruger
router.get('/admin/:id', getBruger, (req, res) => {

    res.json(res.enBruger);
})


/** ADMIN ROUTERS */

// Router til at oprette en bruger
router.post('/admin', async (req, res) => {
    const bruger = new BrugerFil({
        brugernavn: req.body.brugernavn,
        email: req.body.email,
        password: req.body.password
    })
    try{
        const nyBruger = await bruger.save();
        res.status(201).json(nyBruger);
    } catch(error){
        res.status(400).json({message: error.message});
    }
})

// Router til at ændre en bruger
router.patch('/admin/:id', getBruger, async (req, res) => {
    
    if(req.body.brugernavn != null){
        res.enBruger.brugernavn = req.body.brugernavn;
    }
    if(req.body.email != null){
        res.enBruger.email = req.body.email;
    }
    if(req.body.password != null){
        res.enBruger.password = req.body.password;
    }
    try{
        const updatedBruger = await res.enBruger.save();
        res.json(updatedBruger);
    } catch(error){
        res.status(400).json({message: error.message});
    }
})

// Router til at slette en bruger
router.delete('/admin/:id', getBruger, async (req, res) => {
    
    try{

        await res.enBruger.remove();
        res.json({message: "Den valgte bruger er slettet"});

    } catch(error){

        res.status(500).json({message: error.message});
    }
})


// Middleware function til at få en enkelt bruger via id
async function getBruger(req, res, next){
    let enBruger;
    try{

        enBruger = await BrugerFil.findById(req.params.id);
        if(enBruger == null){
            return res.status(404).json({message: 'Kan ikke finde brugeren'});
        }
    } catch(error){
        return res.status(500).json({message: error.message});
    }

    res.enBruger = enBruger;
    next();
}

module.exports = router