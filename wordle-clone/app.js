const letters = document.querySelectorAll('.score-container')
const loadingDiv = document.querySelector('.info-bar')
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

async function init() {
    let currentGuess = '';
    let currentRow = 0;
    let isLoading = true;
    let done = false;

    // res is a shortword for response from api
    const res = await fetch("https://words.dev-apis.com/word-of-the-day"); //?random=1
    const resObj = await res.json(); // or const { word }
    const word = resObj.word.toUpperCase();
    const wordParts = word.split("");
    setLoading(isLoading);
    isLoading = false;


    function addLetter(letter)  {
        if (currentGuess.length < ANSWER_LENGTH) {
            // add letters
            currentGuess += letter;
        } else {
            // change last letter
             currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
        }

        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
    }

    // row incrementation
    async function commit() {
        if (currentGuess.length != ANSWER_LENGTH) {
            // do nothing
            return;
        }

        // TODO validate word
        isLoading = true;
        setLoading(true);
        const res = await fetch("https://words.dev-apis.com/validate-word", {
            method: "POST",
            body: JSON.stringify({ word: currentGuess })
        });
        console.log(res);

        const resObj = await res.json();
        const validWord = resObj.validWord;
        // const { validWord } = resObj;

        isLoading = false;
        setLoading(false);

        if (!validWord) {
            markInvalidWord();
            return;
        }

        // TODO do markings "correct" "close" "wrong"
        const guessParts = currentGuess.split("");
        const map = makeMap(wordParts);

        for (let i = 0; i < ANSWER_LENGTH; i++) {
            // mark as correct
            if (guessParts[i] === wordParts[i]) {
                letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
                // remember Pools? need to remove "o" once
                map[guessParts[i]]--;
            }
        }

        for (let i = 0; i < ANSWER_LENGTH; i++) {
            // mark as wrong
            if (guessParts[i] === wordParts[i]) {
                // do nothing
            } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
                // mark as close
                letters[currentRow * ANSWER_LENGTH + i].classList.add("close")
            } else {
                // mark as incorrect
                letters[currentRow * ANSWER_LENGTH + i].classList.add("incorrect")
            }
        }

        // TODO win/lose?
        currentRow++;
        if (currentGuess === word) {
            // win
            alert("You've completed the puzzle!");
            done = true;
            return;
        } else if (currentRow === ROUNDS) {
            alert(`Try again next time! The correct word was ${word}`);
            done = true;    
        }
        currentGuess = '';        
    }

    function backspace() {
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
    }

    function markInvalidWord() {
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            letters[ANSWER_LENGTH * currentRow + i].classList.add("invalid");
            setTimeout(function () {
                letters[ANSWER_LENGTH * currentRow + i].classList.remove("invalid");
            }, 30);
        }
    }

    document.addEventListener('keydown', function handleKeyPress (event) {
        if (done || isLoading) {
            // do nothing
            return;
        }

        const action = event.key;

        if (action === 'Enter') {
            commit();
        } else if (action === 'Backspace') {
            backspace();
        } else if (isLetter(action)) {
            addLetter(action.toUpperCase());
        } else {
            //ignore

        }
    });
}

function isLetter(letter) {
    return /^[a-zA-Z]$/ .test(letter);
}

function setLoading(isLoading) {
    loadingDiv.classList.toggle('show', isLoading);
}

function makeMap(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
        const letter = array[i]
        if (obj[letter]) {
            obj[letter]++;
        } else {
            obj[letter] = 1;
        }
    }
    return obj;
}

init();
