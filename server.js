const express = require('express')
const app = express()
const gameRouter = require('./routes/route')
const path = require('path')
const cors = require('cors')


app.use(cors())

app.use(express.json())


app.use(express.static(__dirname))
app.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, './welcome.html'))
})

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, './game.html'))
})


app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, './dashboard.html'))
})

app.use('/api', gameRouter)

const PORT = 3003
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})