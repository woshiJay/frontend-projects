let buffer = '0';
let runningTotal = 0;
let previousOperator;
const screen = document.querySelector('.screen');

function buttonClick(value) {
    if (isNaN(parseInt(value))) {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }
    renderScreen();
}

function handleNumber(number) {
    if (buffer === "0") {
        buffer = number;
    } else {
        buffer += number;
    }
}

function handleMath(value) {
    if (buffer === "0") {
        return; // nothing happens
    }

    const intBuffer = parseInt(buffer);
    if (runningTotal === 0) {
        runningTotal = intBuffer;
    } else {
        flushOperation(intBuffer);
    }

    previousOperator = value;

    buffer = "0";
    return runningTotal;
}

function flushOperation(intBuffer) {
    if (previousOperator === '+') {
        runningTotal += intBuffer;
    } else if (previousOperator === '-') {
        runningTotal -= intBuffer;
    } else if (previousOperator === 'x') {
        runningTotal *= intBuffer;
    } else if (previousOperator === '÷') {
        runningTotal /= intBuffer;
    }
    console.log(runningTotal)
}

function handleSymbol(value) {
    switch(value) {
        case 'AC':
            buffer = "0";
            runningTotal = 0;
            break;
        case '=':
            if (previousOperator === null) {
                return; // need numbers to math
            } 
            flushOperation(parseInt(buffer));
            previousOperator = null;
            buffer = +runningTotal; //if first item is string, the next following will be converted to string
            runningTotal = 0;
            break;
        case '←':
            if (buffer.length === 1) {
                buffer = "0";
            } else {
                buffer = buffer.substring(0, buffer.length - 1);
            }
            break;
        case '+':
        case '-':
        case 'x':
        case '÷':
            handleMath(value);
            break;
    }  
}

function init() {
    document
    .querySelector(".buttonContainer")
    .addEventListener("click", function(event){
        buttonClick(event.target.innerText);
    });
}

// function renderScreen() {
//     screen.innerText = buffer; // takes value from buffer and renders it out
// }

function renderScreen() {
    screen.innerText = runningTotal === 0 ? buffer : runningTotal; // displays runningTotal if it's not 0, otherwise displays buffer
}

init();