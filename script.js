/* ------------LIBRARIES-------------- */
import GraphemeSplitter from 'https://cdn.jsdelivr.net/npm/grapheme-splitter@1.0.4/+esm'
const splitter = new GraphemeSplitter()

import chartJs from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.4/+esm'
const ctx = document.getElementById('myChart')


/* ---------TEXT APIs------- */
const RANDOM_TRUONGANHNGOC_URL = 'https://blv-anh-ngok-said.onrender.com/api/quotes/1' // https://github.com/phamduylong/truong-anh-ngok-quotes?tab=readme-ov-file
const RANDOM_ENGLISH_URL = 'https://api.quotable.io/random'
const RANDOM_VIETNAMESE_URL = 'https://api.tracau.vn/quote/random'

/* ---------FUNCTIONS--------- */

// ==Typing==
const textDisplayElement = document.getElementById('textDisplay')
const textInputElement = document.getElementById('textInput')
textInputElement.addEventListener('input', () => {
    const arrayText = Array.from(textDisplayElement.querySelectorAll('span'))
    const arrayValue = Array.from(textInputElement.value)

    arrayText.forEach((characterSpan, index) => {
        const character = arrayValue[index]
        if (character == null) {
            characterSpan.classList.remove('correctType')
            characterSpan.classList.remove('incorrectType')
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correctType')
            characterSpan.classList.remove('incorrectType')
        } else {
            characterSpan.classList.remove('correctType')
            characterSpan.classList.add('incorrectType')
        }
    })

    if (arrayValue.length === arrayText.length && arrayValue.join('') === arrayText.map(character => character.innerText).join('')) {
        // If the input text is equal to the text displayed with compensation for the final character
        renderText()
    }
})

// Get random text from the API
// Manage state for the current mode
let currentMode = 'TAN';

// Set up event listeners for the buttons
document.getElementById('btnTAN').addEventListener('click', () => {
    currentMode = 'TAN';
    renderText(); // Update text display immediately after button click
});

document.getElementById('btnEnglish').addEventListener('click', () => {
    currentMode = 'ENG';
    renderText(); // Update text display immediately after button click
});

// Get random text based on the current mode
function getRandomText() {
    if (currentMode === 'TAN') {
        return fetch(RANDOM_TRUONGANHNGOC_URL)
            .then(response => response.json())
            .then(data => data.data);
    } else if (currentMode === 'ENG') {
        return fetch(RANDOM_ENGLISH_URL)
            .then(response => response.json())
            .then(data => data.content);
    }
    renderText()
}

async function renderText() {
    if (textDisplayElement.innerHTML !== '') {
        textDisplayElement.innerHTML = ''
    }

    const text = await getRandomText()

    // Ensure that the text returned is a string (just in case)
    const textToRender = typeof text === 'string' ? text : JSON.stringify(text) 
    // Parse the string into individual characters (using grapheme-splitter)
    const characters = splitter.splitGraphemes(textToRender)
    // Remove [""] from the array
    if (characters[0] === '[') characters.shift()
    if (characters[0] === '"') characters.shift()
    if (characters[characters.length - 1] === ']') characters.pop()
    if (characters[characters.length - 1] === '"') characters.pop()
    
    characters.forEach(character => {
        const characterSpan = document.createElement('span')
        characterSpan.innerText = character
        textDisplayElement.appendChild(characterSpan) // append character to textDisplayElement
    })
    textInputElement.value = null
    
    // Timer will start at the first input
    IfFirstInput()
 
    // TODO LIST
    // Timer amount picker: 30s, 1m, 2m
    // Stop: stop the timer and the game (clear all texts or cancel the game via button/esc key)
    // KPS: Keys per second
    // Accuracy: correct / total
    // Graph: KPS, Accuracy over time
    // Save data to local storage ??
}

// Check if the first input is entered
let firstInput = true
function IfFirstInput() {
    textInputElement.addEventListener('input', () => {
        if (firstInput) {
            firstInput = false
            startTimer()
        }
    })
}

// ==Timer== 
// Set timer for the game   
// When the first input is entered, the timer will start
// When times up, the game will stop and the result will be displayed (KPS, Accuracy)
function setGameTimer() {
    // 30s
    // 1m 
    // 2m
}

// Because setInterval is not accurate, we need to use Date object to calculate the time
let startTime
function getTimerTime() {
    const currentTime = new Date()
    const elapsedTime = (currentTime - startTime) / 1000 // convert to seconds
    return timerElement.innerText = elapsedTime.toFixed(1) 
}

const timerElement = document.getElementById('timer')
// Store the interval ID to clear it later
let timerIntervalId;
function startTimer() {
    timerElement.innerText = 0.0;
    startTime = new Date();
    timerIntervalId = setInterval(() => {
        timerElement.innerText = getTimerTime();
    }, 100); // update every 100ms

    // If the game is canceled (ESC key), the timer will stop and result will be displayed
    addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            displayResult(); // Display the result
            clearInterval(timerIntervalId); // Stop the timer
            startTime = new Date(); // Reset the timer start time
            firstInput = true; // Reset the input flag to start the timer again
            //timerElement.innerText = 0.0; // Reset the displayed time (optional)
            //textInputElement.value = ''; // Clear the input field (optional)
            //textDisplayElement.innerHTML = ''; // Clear the displayed text (optional)
        }
    });

    // If the timer reaches timeLimit, the game will stop and the result will be displayed
}

// ==Results==
// Display the results of the game
const resultElement = document.getElementById('kps')
function displayResult() {
    // Display KPS and Accuracy
    const kps = calculateKPS()
    resultElement.innerText = `${kps} keys/s`
}

// Keys per minute
// Calculate the number of keys per second
// KPS = (number of correct characters) / (time elapsed)
function calculateKPS() {
    const characters = textDisplayElement.querySelectorAll('span')
    let correctCharacters = 0
    characters.forEach((character, index) => {
        if (textInputElement.value[index] === character.innerText) {
            correctCharacters++
        }
    })
    //console.log(correctCharacters)
    const timeElapsed = parseFloat(timerElement.innerText)
    console.log(timeElapsed)
    return (correctCharacters / timeElapsed).toFixed(2)
}

// Accuracy

// Line graph of KPS and Accuracy over time

/* ---------MAIN--------- */