// Operator functions
const add = (a,b) => a + b;
const subtract = (a,b) => a - b;
const multiply = (a,b) => a * b;
const divide = (a,b) => {
    if(b === 0) {
        error = true;
        return "undefined"
    } 
    return a / b;
}

// Function for operating
const operate = (a,operator,b) => {
    switch(operator) {
        case '+':
            return add(a,b);
        case '-':
            return subtract(a,b);
        case '×':                   // U+00d7; not to be confused with x (U+0078)
            return multiply(a,b);
        case '÷':
            return divide(a,b);
        default:
            return "Invalid operator";
    }
}

const screen = document.querySelector('.screen-digits');

const buttons = document.querySelectorAll('button');
buttons.forEach((button) => {
    if (!button.classList.contains("clear")) {
        button.classList.add(`unicode-${button.textContent.charCodeAt(0)}`);
    }
    button.addEventListener('mousedown', mouseHandler);

    const front = document.createElement('div');
    const back = document.createElement('div');
    front.classList.add('front', 'btn-front');
    back.classList.add('back');
    front.textContent = button.textContent;
    button.textContent = "";
    button.appendChild(back);
    button.appendChild(front);
});

const bevels = document.querySelectorAll('.bevel');
bevels.forEach((bevel) => {
    const parent = bevel.parentNode;
    const wrapper = document.createElement('div');
    const back = document.createElement('div');
    wrapper.classList.add('bevel-container');
    back.classList.add('back');
    bevel.classList.add('front');
    const bevelStyles = getComputedStyle(bevel);
    wrapper.style.backgroundColor = bevelStyles.getPropertyValue('background-color');
    wrapper.style.borderRadius = bevelStyles.getPropertyValue('border-radius');
    parent.replaceChild(wrapper, bevel);
    wrapper.appendChild(back)
    wrapper.appendChild(bevel);
});

document.addEventListener('mouseup', mouseHandler);

function mouseHandler(e) {
    if (e.type === "mousedown") {
        pressKey(e.currentTarget);
        e.currentTarget.classList.add('clicked');
    }
    if (e.type === "mouseup") {
        const key = document.querySelector('.clicked')
        if (key) releaseKey(key);
    }
}

let operator = null;
let operand1 = null;
let operand2 = null;
let error = false;
let mode = "idle";

function pressKey(key) {
    playKey(key, 1);
    
    if (key.classList.contains("clear-all")) {
        reset();
        return;
    }
    if (error) {
        return;
    }
    if (key.classList.contains("operator")) {
        if (mode === "idle") {
            if (key.textContent === "-") {
                screen.textContent = "-";
                mode = "inOperand1";
            }
            return;
        }
        if (mode === "inOperand1") operand1 = screen.textContent;
        if (mode === "inOperand2") {
            operand2 = screen.textContent;
            operand1 = calculate();
        }
        mode = "operator";
        operator = key.textContent;
        return;
    }
    if (key.classList.contains("equals")) {
        if (mode === "inOperand2") {
           operand2 = screen.textContent;
           operand1 = calculate();
        }
        if (mode === "result") {
            operand1 = screen.textContent;
            if(operand2) calculate();
        }
        mode = "result";
        return;
    }
    if (key.classList.contains("backspace")) {
        if (mode === "result") {
            reset();
            return;
        }
        removeHangingPoint(screen);
        removeLastCharacter(screen);
        removeHangingPoint(screen);
        return;
    }
    populateScreen(key);
}

function calculate() {
        result = operate(+operand1, operator, +operand2);
        if (result.toString().length + (result < 0) >= 10) {
            if (result < 10000000000) {
                result = result.toFixed(10 - (Math.floor(result).toString().length + (result < 0)));
            } else {
                error = true;
                result = "2 BIG uwu"
            }
        }
        screen.textContent  = result;
        return result;
    }

function releaseKey(key) {
    playKey(key, 0);
    key.classList.remove('clicked');
}

function populateScreen(key) {
    inputNumber(key);
    currentText = screen.textContent;
}

function reset() {
    screen.textContent = "";
    operand1 = null;
    operator = null;
    operand2 = null;
    error = false;
    mode = "idle";
}

function inputNumber(key) {
    if (!(mode === "inOperand1" || mode === "inOperand2")) {
        screen.textContent = "";
        mode = (mode === "operator") ? "inOperand2" : "inOperand1";
    } 
    if((screen.textContent) === "0") screen.textContent = "";
    if (key.textContent === ".") {
        if (screen.textContent.includes(".")) return;
        if(screen.textContent === "") {
            screen.textContent = "0.";
            return;
        }
    }
    if ((screen.textContent.length -
        screen.textContent.includes(".")) <10) { /* otherwise, decimal point occupies extra character */
            screen.textContent += key.textContent;
    }
}

function removeLastCharacter(obj) {
    obj.textContent = obj.textContent.slice(0, -1);
}

function removeHangingPoint(obj) {
    if (obj.textContent.slice(-1) === ".") removeLastCharacter(obj);
}

function playKey(key, state) {
    let num;
    if (state === 1) {
        num = Math.floor(Math.random()*4+1);
        key.num = num;
    }
    if (state === 0) {
        num = key.num;
        key.num = "";
    }
    const audio = document.querySelector(`audio[data-id="${num}_${state}"]`);
    audio.currentTime = 0;
    audio.play();
}

document.addEventListener('keydown', (e) => {
    if(!e.repeat) {
        keyboardHandler(e.key, e.type);
    }
});
document.addEventListener('keyup', (e) => {
    if(!e.repeat) {
        keyboardHandler(e.key, e.type);
    }
});

function keyboardHandler(key, type) {
    const keyCode = getKeyCode(key);
    let keyObj;
    if (keyCode === null) return;
    if (isNaN(+keyCode)) {
        keyObj = document.querySelector(`.${keyCode}`);
    } else {
        keyObj = document.querySelector(`.unicode-${keyCode}`);
    }
    if (type === "keydown") {
        pressKey(keyObj);
        keyObj.lastElementChild.classList.add("virtualclick");
    }
    if (type === "keyup") {
        releaseKey(keyObj);
        keyObj.lastElementChild.classList.remove("virtualclick");
    }
}

function getKeyCode(key) {
    if (!isNaN(+key)) return key.charCodeAt(0);
    switch(key) {
        case ".":
        case ",":
            return 46; // ".".charCodeAt(0);
        case "Enter":
        case "=":
            return 61; // "=".charCodeAt(0);
        case "+":
        case "-":
            return key.charCodeAt(0);
        case "x":
        case "X":
        case "*":
            return 215; // "×".charCodeAt(0);
        case "/":
            return 247; // "÷".charCodeAt(0);
        case "c":
        case "C":
        case "Escape":
            return "clear-all";
        case "Backspace":
            return "backspace";
        default:
            return null;
    }
}