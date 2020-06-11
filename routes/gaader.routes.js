const express = require('express');
const router = express.Router();
const GaadeFil = require('../models/gaade.model');

// Router til at få alle gåder
router.get('/', async (req, res) => {
    try{
        const gaadere = await GaadeFil.find();
        res.json(gaadere);
    } catch(error){
        res.status(500).json({message: error.message});
    }
})

// Router til at få en enkelt gåder
router.get('/:id', getGaade, (req, res) => {
    res.json(res.enGaade);
})

/**Administrator routers */

// Router til at oprette en gåder
router.post('/admin', async (req, res) => {
    const gaader = new GaadeFil({
        gaade: req.body.gaade,
        svar: req.body.svar,
    })
    try{
        const nyGaade = await gaader.save();
        res.status(201).json(nyGaade);
    } catch(error){
        res.status(400).json({message: error.message});
    }
})


// Router til at ændre en gåder
router.patch('/admin/:id', getGaade, async (req, res) => {
    
    if(req.body.gaade != null){
        res.enGaade.gaade = req.body.gaade;
    }
    if(req.body.svar != null){
        res.enGaade.svar = req.body.svar;
    }
    
    try{
        const updatedGaade = await res.enGaade.save();
        res.json(updatedGaade);
    } catch(error){
        res.status(400).json({message: error.message});
    }
})

// Router til at slette en gåder
router.delete('/admin/:id', getGaade, async (req, res) => {
    
    try{

        await res.enGaade.remove();
        res.json({message: "Den valgte gåde er slettet"});

    } catch(error){
        
        res.status(500).json({message: error.message});
    }
})



// Middleware function til at få en enkelt gåder via id
async function getGaade(req, res, next){
    let enGaade;
    try{

        enGaade = await GaadeFil.findById(req.params.id);
        if(enGaade == null){
            return res.status(404).json({message: 'Kan ikke finde gåden'});
        }
    } catch(error){
        return res.status(500).json({message: error.message});
    }

    res.enGaade = enGaade;
    next();
}

module.exports = router