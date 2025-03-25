const express = require('express')
const router = express.Router()
const db = require('../model/db')


const { showRandAnswers, getGameRound } = require('../controller.js')

router.get('/welcome')
router.get('/game', getGameRound)
router.post('/game', showRandAnswers)

module.exports = router