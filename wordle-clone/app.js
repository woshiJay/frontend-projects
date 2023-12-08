const letters = document.querySelectorAll('.score-container')
const loadingDiv = document.querySelector('.info-bar')
const ANSWER_LENGTH = 5;

async function init() {
    let currentGuess = '';
    let currentRow = 0;

    // res is a shortword for response from api
    const res = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
    const resObj = await res.json(); // or const { word }
    const word = resObj.word.toUpperCase();

    console.log(word);

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

        // TODO do markings "correct" "close" "wrong"

        // TODO win/lose?
        currentRow++;
        currentGuess = '';
    }

    function backspace() {
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
    }



    document.addEventListener('keydown', function handleKeyPress (event) {
        const action = event.key;

        console.log(action);

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

init();
