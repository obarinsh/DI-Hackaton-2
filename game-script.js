const newDiv = document.createElement('div')
newDiv.id = 'dynamic-div'

const h2Question = document.createElement('h2')
h2Question.id = 'question'
h2Question.textContent = 'Loading question...'


const h2Answers = document.createElement('div')
h2Answers.id = 'answers'

const submitButt = document.createElement('button')
submitButt.id = 'submit-button'
submitButt.textContent = 'Submit'

const isCorrect = document.createElement('div')
isCorrect.id = 'is-correct'

const results = document.createElement('div')
results.id = 'results'


newDiv.appendChild(h2Question)
newDiv.appendChild(h2Answers)
h2Answers.appendChild(submitButt)
newDiv.appendChild(isCorrect)
document.body.appendChild(newDiv)

let currentQuestion = 0;
let amountOfQuestions = 20
let currentAnswer = ''
let currentCountry = null
let score = 0
const gameHistory = []

async function fetchRound() {
    try {
        const response = await fetch('/api/game')
        const data = await response.json()
        currentAnswer = data.correctAnswer
        currentCountry = data.correctCountry
        return data
    } catch (error) {
        console.error('Error fetching or parsing round:', error)
        h2Question.textContent = 'Failed to load round'
    }
}

async function showRound() {
    let data = await fetchRound()
    if (!data) {
        console.warn('No data returned from fetchRound')
        return
    }

    currentAnswer = data.correctAnswer
    const hintEl = document.getElementById('text-hint')
    if (hintEl) {
        hintEl.style.display = 'none'
    }
    renderQuestion(data.question)
    renderAnswers(data.answers)

}

function renderQuestion(questionText) {
    // h2Question.innerHTML = questionText || 'No question found'
    currentQuestionText = questionText
    h2Question.innerHTML = `Question ${currentQuestion + 1}/${amountOfQuestions}:<br> ${questionText}`
}

function renderAnswers(answers) {
    h2Answers.innerHTML = ''
    answers.forEach((answer, index) => {
        const label = document.createElement('label')
        label.style.display = 'block'

        const input = document.createElement('input')
        input.type = 'radio'
        input.name = 'countryAnswer'
        input.value = answer
        input.id = `answer-${index}`

        const span = document.createElement('span')
        span.textContent = answer

        label.appendChild(input)
        label.appendChild(span)
        h2Answers.appendChild(label)
    })
    h2Answers.appendChild(submitButt)
}

async function initGame() {
    currentQuestion = 0;
    currentAnswer = ''
    score = 0
}

async function startGame() {
    initGame()
    await showRound()
}

async function getFiftyFifty(currentAnswer) {
    const labels = document.querySelectorAll('#answers label')
    const wrongLabels = Array.from(labels).filter(label => {
        const input = label.querySelector('input')
        return input.value !== currentAnswer
    })
    const toHide = wrongLabels.sort(() => Math.random() - 0.5).slice(0, 2)

    toHide.forEach(label => {
        label.style.visibility = 'hidden' // 
    })
}

async function getHint() {
    if (!currentCountry) return
    console.log(currentCountry)
    const continent = currentCountry.continent || 'an unknown'
    let hintText = document.getElementById('text-hint')
    if (!hintText) {
        hintText = document.getElementById('hint-text')
        hintText.style.marginTop = '12px'
        hintText.style.color = 'gold'
        hintText.style.fontWeight = 'bold'
        document.body.appendChild(hintText)
    }
    hintText.style.display = 'block'
    hintText.innerHTML = `🧭 Hint: This country is in the <strong>${continent}</strong> continent.`
}
let fiftyFiftyBtn = document.getElementById('fifty-fifty')
let hintBtn = document.getElementById('hint')

fiftyFiftyBtn.addEventListener('click', () => {
    getFiftyFifty(currentAnswer)
    fiftyFiftyBtn.disabled = true
    fiftyFiftyBtn.style.backgroundColor = 'grey'
})

hintBtn.addEventListener('click', () => {
    getHint()
    hintBtn.disabled = true
    hintBtn.style.backgroundColor = 'grey'
})
submitButt.addEventListener('click', async () => {

    const selectedAnswer = document.querySelector('input[name="countryAnswer"]:checked')
    if (!selectedAnswer) {
        alert('Please select an answer.')
        return
    }
    const userAnswer = selectedAnswer.value
    const isCorrect = userAnswer === currentAnswer

    gameHistory.push({
        question: currentQuestion,       // <- store this in renderQuestion()
        correctAnswer: currentAnswer,
        userAnswer,
        isCorrect,
    })

    if (isCorrect) {
        score++
    }
    // isCorrect.innerText = 'Correct! 😊'
    // } else {
    //     isCorrect.innerText = 'Wrong! 😟'
    // }

    currentQuestion++
    if (currentQuestion < amountOfQuestions) {
        await showRound()
    } else {
        newDiv.innerHTML = `Your score is ${score} out of ${amountOfQuestions}<br>`
        if (score === amountOfQuestions) {
            newDiv.innerHTML += `Congratulations! Your geography knowledgement is impressive!<br>`
        } else if (score >= 15 && score <= 19) {
            newDiv.innerHTML += `You're a great geographer! Keep up the good work!<br>`
        } else if (score >= 10 && score <= 14) {
            newDiv.innerHTML += `Not bad, but you can do better!<br>`
        } else if (score >= 5 && score <= 9) {
            newDiv.innerHTML += `You need to improve your geography knowledge!<br>`
        } else {
            newDiv.innerHTML += `You're a beginner! Don't give up, keep practicing!<br>`
        }


        newDiv.style.color = 'gold'
        newDiv.style.backgroundColor = '#111a4d'
        newDiv.style.border = '3px solid gold'
        newDiv.style.padding = '30px'
        newDiv.style.borderRadius = '15px'
        newDiv.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.5)'
        newDiv.style.textAlign = 'center'
        newDiv.style.fontSize = '22px'


        let restartBtn = document.createElement('button')
        restartBtn.innerHTML = 'Play Again'
        restartBtn.id = 'restart'
        newDiv.appendChild(restartBtn)
        showGameSummary()
        restartBtn.addEventListener('click', () => location.reload())
        h2Answers.innerHTML = ''
        h2Question.textContent = ''
    }
})


async function showGameSummary() {
    hintBtn.style.display = 'none'
    fiftyFiftyBtn.style.display = 'none'
    results.style.marginTop = '20px'
    results.style.color = 'gold'
    results.style.backgroundColor = '#111a4d'
    results.style.border = '3px solid gold'
    results.style.padding = '30px'
    results.style.borderRadius = '15px'
    results.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.5)'
    results.style.textAlign = 'center'
    results.style.fontSize = '22px'
    const title = document.createElement('h3')
    title.textContent = '📋 Game Summary'
    results.appendChild(title)

    gameHistory.forEach((round, index) => {
        const line = document.createElement('p')
        line.innerHTML = `Q${index + 1}: <br>
        Your answer: <strong>${round.userAnswer}</strong> 
        – ${round.isCorrect ? '✅ Correct' : `❌ Incorrect (Correct: ${round.correctAnswer})`}<br><br>`
        results.appendChild(line)
    })
    document.body.appendChild(results)
}
startGame()