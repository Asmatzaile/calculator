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

const buttons = document.querySelectorAll('button');
buttons.forEach((button) => {
    const front = document.createElement('div');
    const back = document.createElement('div');
    front.classList.add('front', 'btn-front');
    back.classList.add('back');
    front.textContent = button.textContent;
    button.addEventListener('mousedown', playAudio);
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

document.addEventListener('mouseup', playAudio);

function playAudio(e) {
    if (e.type === "mousedown") {
        const num = Math.floor(Math.random()*4+1);
        const audio = document.querySelector(`audio[data-id="${num}_1"]`);
        e.target.classList.add('pressed');
        e.target.num = num;
        audio.play();
    }
    if (e.type === "mouseup") {
        const pressedList = document.querySelectorAll('.pressed');
        pressedList.forEach(releaseKey);
    }
}

function releaseKey(pressed) {
    const audio = document.querySelector(`audio[data-id="${pressed.num}_0"]`);
    audio.play();
    pressed.num = "";
    pressed.classList.remove('pressed');
}