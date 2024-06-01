async function fetchJSON() {
   try {
      const response = await fetch("assets/scripts/puzzle.json");
      const data = await response.json();
      console.log(data);
      return data;
   } catch (error) {
      console.error(error);
   }
}

function handleInput(event) {
   console.log("handling input");
   if (
      event.key !== "Backspace" &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight"
   ) {
      const currentInput = event.target;
      const currentId = parseInt(currentInput.id);
      if (currentInput.value.length === 1) {
         const nextId = currentId + 1;
         const nextInput = document.getElementById(`${nextId}`);
         if (nextInput) {
            nextInput.focus();
            nextInput.value = ``;
         }
      }
   }
}

function changeActiveInput(currentIndex, moveValue) {
   console.log("current index: " + currentIndex);
   console.log("move value: " + moveValue);
   const nextId = parseInt(currentIndex, 10) + parseInt(moveValue, 10);
   console.log("next value: " + nextId);
   const nextInput = document.getElementById(`${nextId}`);
   console.log(nextInput);
   if (nextInput) {
      nextInput.focus();
   }
}

function checkAnswers() {
   console.log("Checking Answers");
   //grab each of the input blocks
   const inputBlocks = document.querySelectorAll(".inputBlock");
   //console.log(inputBlocks)

   //answers will be stored here
   let inputGuesses = [];
   //each of the input blocks will contain 4 input fields to iterate over
   inputBlocks.forEach((block) => {
      //within the blocks we want to find each input field
      const guessInputs = block.querySelectorAll(".guessInput");
      //console.log(guessInputs);
      let guess = ""; //and concatenate the guess string
      guessInputs.forEach((guessCharacter) => {
         //by iterating over each of the inputs
         //console.log(guessCharacter.value);
         guess += guessCharacter.value.toUpperCase();
      });
      //console.log(guess);
      inputGuesses.push(guess);
   });

   //console.log(inputGuesses);
   //console.log(puzzleAnswers);
   let answerBeingChecked = 0;
   let correctAnswers = 0;
   puzzleAnswers.forEach((answer) => {
      const guess = inputGuesses[answerBeingChecked];
      console.log("User Guess: " + guess + " Answer: " + answer);
      if (guess === answer){
        correctAnswers++;
        //console.log("Answer #" + answerBeingChecked + " correct!" + " # correct: " + correctAnswers);
      } else {
        //console.log("Answer # " + answerBeingChecked + " incorrect");
      }
      answerBeingChecked++;
   });
   //console.log("Correct: " + correctAnswers + " answers: " + puzzleAnswers.length)
   if (correctAnswers === puzzleAnswers.length){
        indicateSuccess();
   } else {
        indicateIncorrectAnswers();
   }
}

function indicateSuccess(){
    const successPanel = document.querySelector(".success")
    successPanel.classList.remove("hide");
}

function indicateIncorrectAnswers(){
    const failurePanel = document.querySelector(".keepTrying");
    failurePanel.classList.remove("hide");
    setTimeout(() =>{
        failurePanel.classList.add("hide");
    }, 3000)
}

//handling for backspace input
document.body.addEventListener("keydown", function (event) {
   const currentElement = document.activeElement;
   if (event.key === "Backspace") {
      if (currentElement && currentElement.tagName === "INPUT") {
         console.log("handling backspace");
         const currentInput = event.target;
         const currentId = parseInt(currentInput.id);
         //console.log(target);
         if (currentInput.value.length === 0) {
            const prevId = currentId - 1;
            const prevInput = document.getElementById(`${prevId}`);
            if (prevInput) {
               prevInput.focus();
            }
         }
         if (currentInput.value.length === 1) {
            currentInput.value = "";
         }
      }
   }

   if (event.key === "ArrowLeft") {
      console.log("left arrow");
      if (currentElement && currentElement.tagName === "INPUT") {
         changeActiveInput(currentElement.id, -1);
      }
   }
   if (event.key === "ArrowRight") {
      if (currentElement && currentElement.tagName === "INPUT") {
         changeActiveInput(currentElement.id, +1);
      }
   }
});

const jsonData = await fetchJSON();
const startValue = jsonData.Start;
const endValue = jsonData.End;
console.log(startValue);
const puzzleItems = jsonData.Entries;
let puzzleAnswers = [];

const puzzleEntires = document.getElementById("puzzleEntries");
console.log(puzzleItems);
let inputIndex = 0;
let clueIndex = 0;

puzzleItems.forEach((element) => {
   console.log(element);
   puzzleAnswers.push(element.answer);
   //console.log(puzzleAnswers)
   const clue = document.createElement("div");
   clue.classList.add("clueGroup");
   clue.innerHTML += `<p>${element.clue}</p>`;
   const answerInputBlock = document.createElement("div");
   answerInputBlock.classList.add("inputBlock");
   answerInputBlock.id = `answer-${clueIndex}`;
   for (let i = 0; i < 4; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = inputIndex;
      input.maxLength = 1;
      input.classList.add("guessInput");
      answerInputBlock.appendChild(input);
      //const input = `<input type="text" class="guessInput" id=${inputIndex} maxLength="1">`

      inputIndex++;
   }
   clueIndex++;
   puzzleEntires.appendChild(clue);
   clue.appendChild(answerInputBlock);
});

const startingDiv = document.getElementById("startingWord");
startingDiv.innerText = startValue;
const endingDiv = document.getElementById("endingWord");
endingDiv.innerText = endValue;
const inputFields = document.querySelectorAll(".guessInput");
inputFields.forEach((input) => input.addEventListener("keyup", handleInput));
const checkAnswersButton = document.getElementById("checkAnswersButton");
checkAnswersButton.addEventListener("click", checkAnswers);
