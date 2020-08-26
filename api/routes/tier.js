const express = require('express')
const router = express.Router()
const tier_controler = require('../controllers/tier')
const middelware = require('../middelware/chack_auth')
router.post('/getTier1',tier_controler.getTier1)
router.post('/AaddTier1',middelware,tier_controler.AaddTier1)
router.post('/MaddTier1',middelware,tier_controler.MaddTier1)
router.post('/DaddTier1',middelware,tier_controler.DaddTier1)
module.exports = router