const db = require('./model/db')

const getGameRound = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM countries ORDER BY RANDOM() LIMIT 6')
        const countries = result.rows

        if (countries.length < 6) {
            return res.status(404).json({ error: 'Not enough countries in the database' })
        }
        const correctCountry = countries[0]

        const questionTemplates = [
            (c) => `Which country has a population of ${c.population} and a flag like ${c.flag}?`,
            (c) => `Which country has ${c.national_food} as its national dish and its capital is ${c.capital}?`,
            (c) => `Which country speaks ${c.official_languages} and has the flag ${c.flag}?`,
            (c) => `In which country would you be greeted with "${c.greeting}" and eat ${c.national_food}?`,
            (c) => `Which country has the capital ${c.capital} and a population of ${c.population}?`,
            (c) => `Which country’s flag is ${c.flag} and you say "${c.greeting}"?`,
        ]
        const randomTemplate = questionTemplates[Math.floor(Math.random() * questionTemplates.length)]
        const question = randomTemplate(correctCountry)


        const wrongAnswers = countries.slice(1, 4).map(c => c.name)
        const allAnswers = [...wrongAnswers, correctCountry.name]
        const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5)

        res.json({
            question,
            answers: shuffledAnswers,
            correctAnswer: correctCountry.name,
            correctCountry
        })

    } catch (error) {
        console.error('Error fetching questions:', error)
        res.status(500).json({ error: 'Database error occurred' })
    }
}


const showRandAnswers = async (req, res) => {
    try {
        const result = await db.query('SELECT name FROM countries ORDER BY RANDOM() LIMIT 4')
        const countries = result.rows
        const correctCountry = req.body.correctCountry

        const otherCountries = countries.filter(c => c.name !== correctCountry.name)

        const shuffled = [...otherCountries].sort(() => Math.random() - 0.5)

        const wrongAnswers = shuffled.slice(0, 3).map(c => c.name)


        const allAnswers = [...wrongAnswers, correctCountry.name]
        const finalAnswers = allAnswers.sort(() => Math.random() - 0.5)

        res.json({ answers: finalAnswers })
    }
    catch (error) {
        console.error('Error fetching questions:', error)
        res.status(500).json({ error: 'Database error occurred' })
    }
}


module.exports = { getGameRound, showRandAnswers }