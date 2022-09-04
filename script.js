// Operator functions
const add = (a,b) => a + b;
const subtract = (a,b) => a - b;
const multiply = (a,b) => a * b;
const divide = (a,b) => b === 0 ? "undefined" : a / b;

// Function for operating
const operate = (a,operator,b) => {
    switch(operator) {
        case '+':
            return add(a,b);
        case '-':
            return subtract(a,b);
        case '*':
            return multiply(a,b);
        case '/':
            return divide(a,b);
        default:
            return "Invalid operator";
    }
}

const screen = document.querySelector('.screen-digits');

const buttons = document.querySelectorAll('button');
buttons.forEach((button) => {
    const front = document.createElement('div');
    const back = document.createElement('div');
    front.classList.add('front', 'btn-front');
    back.classList.add('back');
    front.textContent = button.textContent;
    button.addEventListener('mousedown', keyHandler);
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

document.addEventListener('mouseup', keyHandler);

function keyHandler(e) {
    if (e.type === "mousedown") pressKey(e.currentTarget);
    if (e.type === "mouseup") {
        const pressedList = document.querySelectorAll('.pressed');
        pressedList.forEach(releaseKey);
    }
}

function pressKey(key) {
    populateScreen(key);    
    const num = Math.floor(Math.random()*4+1);
    const audio = document.querySelector(`audio[data-id="${num}_1"]`);
    key.classList.add('pressed');
    key.num = num;
    audio.currentTime = 0;
    audio.play();
}

function populateScreen(key) {
    if (key.classList.contains("clear-all")) {
        screen.textContent = "";
        return;
    }
    if (key.classList.contains("backspace")) {
        removeHangingPoint(screen);
        removeLastCharacter(screen);
        removeHangingPoint(screen);
        return;
    }
    if (key.classList.contains("number")) {
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
}

function removeLastCharacter(obj) {
    obj.textContent = obj.textContent.slice(0, -1);
}

function removeHangingPoint(obj) {
    if (obj.textContent.slice(-1) === ".") removeLastCharacter(obj);
}

function releaseKey(key) {
    const audio = document.querySelector(`audio[data-id="${key.num}_0"]`);
    audio.currentTime = 0;
    audio.play();
    key.num = "";
    key.classList.remove('pressed');
}