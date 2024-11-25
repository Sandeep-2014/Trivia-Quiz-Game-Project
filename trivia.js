const firstPage = document.querySelector('.registerPage')

const form = document.querySelector('#form')
const firstPlayer = document.querySelector('#firstPlayer')
const secondPlayer = document.querySelector('#secondPlayer')
const cat = document.querySelector('#QuizCat')
const error1 = document.getElementById('error')
error1.style.color = 'red'
error1.style.marginBottom = '4px'
const questionPage = document.querySelector('#questionPage')

// for storing player 1 name
let player1Name;
// for storing player 2 name
let player2Name;
let currentPlayerName;
// for storing difficluty level of question
let currentDifficulty;
// for storing choosen categery quiz questions with different difficulties level
let questionsArr;
// for storing all choosen categories
let selectedCategoryArr = []

let categoryText;


let player1Score = 0
let player2Score = 0
let currentQuestionIndex = 0


form.addEventListener('submit', (e) => {
    e.preventDefault()
    player1Name = firstPlayer.value
    player2Name = secondPlayer.value
    let category = cat.value
    categoryText = document.querySelector(`[value=${category}]`).innerHTML
    // console.log(categoryText);
    console.log(category);

    if (category === 'choose') {
        // showing message if any category is not choosen
        error1.innerHTML = 'Please choose any Category'
    } else if (!selectedCategoryArr.includes(category)) {
        error1.innerHTML = ''
        firstPage.style.display = 'none'
        selectedCategoryArr.push(category)
        fetchSixQuestions(category)
    } else {
        // showing message if user chooses already choosen category that he already played
        error1.innerHTML = 'Please choose another Category'
    }

})


let questionMediumArr = ['easy', 'medium', 'hard']
async function fetchSixQuestions(category) {
    try {
        questionsArr = []

        for (let i = 0; i < questionMediumArr.length; i++) {
            // this will fetch two question of every difficulty like 2 easy, then 2 medium, and ten 2 hard 
            const res = await fetch(`https://the-trivia-api.com/v2/questions?categories=${category}&limit=2&difficulties=${questionMediumArr[i]}`)
            // converting response to json
            let data = await res.json()

            await questionsArr.push(...data)
        }
        console.log('This is six questions arr : ', questionsArr);

        displayQuestionsPage(questionsArr)

    } catch (err) {
        console.error(`This error got while fetching Questions: ${err}`)
        // if we got any type of error while fetching the question so this will show that error on the page.
        firstPage.style.display = 'none'
        questionPage.style.display = 'flex'
        questionPage.style.color = 'red'
        questionPage.style.marginTop = '15px'
        questionPage.innerHTML = `<h3> ${err}</h3>`

    }
}


let ScoreDiv = document.createElement('div')
let player1ScoreBox = document.createElement('span')
let player2ScoreBox = document.createElement('span')
let errorMessage = document.createElement('p')

ScoreDiv.id = 'ScoreDiv'
player1ScoreBox.className = 'score'
player2ScoreBox.className = 'score1'

function displayQuestionsPage(questionsArr) {
    questionPage.style.display = 'flex'
    // storing one question data in this variable
    let question = questionsArr[currentQuestionIndex]
    console.log('current questions is : ', question);
    
    currentDifficulty = question.difficulty
    let correctOpt = question.correctAnswer
    let incorrectOpt = question.incorrectAnswers
    incorrectOpt.push(correctOpt)
    // shuuffling all otions on differnet positions
    let options = suffletheOptions(incorrectOpt)

    let currentQuestion = question.question.text
    // console.log(currentQuestion);

    // chaging player name with this condition of question index will be odd so it player1 otherwise player2
    if (currentQuestionIndex % 2 === 0) {
        currentPlayerName = player1Name
    } else {
        currentPlayerName = player2Name
    }
    // redering question quiz page with question and its option
    questionPage.innerHTML = `<h1> Trivia Quiz Game</h1>
    <h2>Quiz Category: ${categoryText}</h2>
    <h3>Current Questions Difficulty: ${currentDifficulty}</h3>
    <p>${currentPlayerName}'s Turn</p>
    <h3>Q.${currentQuestionIndex + 1} :- ${currentQuestion}</h3>
    <ol type="a"> <li>${options[0]}</li> <li>${options[1]}</li> <li>${options[2]}</li> <li>${options[3]}</li> </ol>`
    questionPage.appendChild(errorMessage)
    questionPage.appendChild(ScoreDiv)
    player1ScoreBox.innerHTML = `${player1Name}'s Score: ${player1Score}`
    player2ScoreBox.innerHTML = `${player2Name}'s Score: ${player2Score}`
    // ScoreDiv will show  both player scores
    ScoreDiv.appendChild(player1ScoreBox)
    ScoreDiv.appendChild(player2ScoreBox)
    // ScoreDiv.style.border = '2px solid Black'

    let li = document.querySelectorAll('li')
    li.forEach((e, i) => {
        e.addEventListener('click', () => {
            let clickedOpt = e.textContent
            updatePlayerScore(clickedOpt, correctOpt, currentDifficulty)
        })
    })

}
let optionsArr = ['sandeep', 'deepak', 'ravi', 'hululu']
// this function is for shuffling options to see this function go to line 103
function suffletheOptions(optionsArr) {
    for (let i = 0; i < optionsArr.length; i++) {
        let index = Math.floor(Math.random() * (i + 1))
        let temp = optionsArr[i]
        optionsArr[i] = optionsArr[index]
        optionsArr[index] = temp
    }
    return optionsArr

}
// this function will update the score according to correct or incorrect answer
function updatePlayerScore(clickedOpt, crorrectAns, difficultyLevel) {

    if (clickedOpt === crorrectAns) {
        errorMessage.innerHTML = 'Your Answer is Correct'
        errorMessage.style.color = 'green'
        // here I am checking which player has given the answer and checkin current question difficulty level according to difficulty level player score will be updated
        if (currentPlayerName === player1Name) {
            if (difficultyLevel === 'easy') {
                player1Score += 10
            } else if (difficultyLevel === 'medium') {
                player1Score += 15
            } else if (difficultyLevel === 'hard') {
                player1Score += 20
            }

        } else if (currentPlayerName === player2Name) {
            if (difficultyLevel === 'easy') {
                player2Score += 10
            } else if (difficultyLevel === 'medium') {
                player2Score += 15
            } else if (difficultyLevel === 'hard') {
                player2Score += 20
            }
        }

        // finnaly here I updating the  updated both players score and displaying on the page
        player1ScoreBox.innerHTML = `${player1Name}'s Score: ${player1Score}`
        player2ScoreBox.innerHTML = `${player2Name}'s Score: ${player2Score}`

    } else {
        // when clicked on incorrect option displaying this message
        errorMessage.innerHTML = 'Your Answer is Incorrect'
        errorMessage.style.color = 'red'
    }

    let li = document.querySelectorAll('li')
    li.forEach((e) => {
        // I am doing this for removing that click addeventlistenr that I have added on li at the line no 133 for updating score now I this addeventlistner will not work 
        e.style.pointerEvents = 'none'
    })
    // after clicking on the any option I am displaying a button for next question
    const nextbtnDiv = document.createElement('div')
    const nextBtn = document.createElement('button')
    nextBtn.innerHTML = 'Next Question'
    nextBtn.id = 'nextBtn'
    nextbtnDiv.appendChild(nextBtn)
    questionPage.appendChild(nextbtnDiv)
    // if that is last question of the category so I am changing content of the button
    if (currentQuestionIndex === 5) {
        nextBtn.innerHTML = 'Go to Next Page'
    }

    // on this clicking nex button It will show next next question
    nextBtn.addEventListener('click', () => {
        errorMessage.innerHTML = ''
        displayNextQuestion(questionsArr)
    })
}


const inputFields = document.querySelector('#inputFields')
function displayNextQuestion(questions) {
    currentQuestionIndex++
    // this condtion is for displaying six question of the selected category questions
    if (currentQuestionIndex < 6) {
        displayQuestionsPage(questions)
    } else {
        // if all question are answered of chosen category so now I am checking is all categories are played or not 

        if (selectedCategoryArr.length < 10) {
            // there are total 10 categories and if there are categories left for playing so this will render two buttons for continue the game or quit the game
            questionPage.innerHTML = `<h1> Trivia Quiz Game</h1>
            <div id='gameBtn'> <button id='continue'>Countinue Game</button>
            <button id='end'>End Game</button> </div>`

            let continueGame = document.querySelector('#continue')
            let endGame = document.querySelector('#end')
            // this event on the continue btn work is displaying the the page for choosing new category
            continueGame.addEventListener('click', () => {
                // if user click this button page so it will not display the question page now it will show firstpage that was for user registeration
                questionPage.style.display = 'none'
                firstPage.style.display = 'flex'
                // on the first page there was two input field also I don't need this time that's why I displaying non to this 
                inputFields.style.display = 'none'
                // here updating currentQuestionIndex 6 to 0
                currentQuestionIndex = 0

            })
            // if user clicked on the endgame btn insted of continue game btn so it will show you the winner of the game
            endGame.addEventListener('click', () => {
                console.log('clicked on end game');
                declaireWinner()

            })

        } else {
            // if user played all categories so after playing all six question of last available categries it will not show the btn for continue and end game btn in this time.
            // it will show you for seeing the winner of this game.
            questionPage.innerHTML = `<h1> All Categories are Played</h1>
                <button id='final'>See Winner</button>`
            const final = document.querySelector('#final')
            final.addEventListener('click', () => {
                declaireWinner()
            })
        }

    }
}
// this function is for calculating the winner of this game by comparing both player scores
function declaireWinner() {
    let winner;
    if (player1Score > player2Score) {
        winner = `Winner is ${player1Name}`
    } else if (player1Score < player2Score) {
        winner = `Winner is ${player2Name}`
    } else {
        winner = 'Game is Tie'
    }
    // this will show the page with both player score and game winner
    questionPage.innerHTML = `<h1> Winner </h1>
    <h2>${player1Name}'s Total Score: ${player1Score}</h2>
    <h2>${player2Name}'s Total Score: ${player2Score}</h2>
    <h3>${winner}
    <div> <button id='goHome'>Go to home Page</button> </div>`
    // in this page there is a btn for go home page through this btn I will go to directly home page. See on the line no 281
    let goHome = document.querySelector('#goHome')
    goHome.addEventListener('click', () => {
        location.reload()
    })
}