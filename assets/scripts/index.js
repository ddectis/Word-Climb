let score = 0;
let level = 1;
const scoreHolder = document.getElementById("score");
const guessInputs = document.querySelectorAll(".guessInput");
const lastGuessHolder = document.querySelector("#lastGuess");
const intro = document.getElementById("intro");
const doNotShowIntroCheck = document.getElementById("clearIntroNextTime");
const invalidGuessIndicator = document.getElementById("invalidGuess");
let lastGuess = "";
let targetWord = "";
let previousGuesses = [];

const clearIntroButton = document.getElementById("clearIntro");
//also check to see if we shuold not show the intro in the future
clearIntroButton.addEventListener("click", function () {
   const isChecked = doNotShowIntroCheck.checked;
   localStorage.setItem("doNotShowIntro", isChecked);
   console.log("Value saved to local storage: " + isChecked);
   intro.classList.add("hide");
});

//also check to see if we should not show the intro on this page load
const doNotShowIntro = localStorage.getItem("doNotShowIntro");
if (doNotShowIntro) {
   console.log("not showing intro");
   intro.classList.add("hide");
}

async function loadDictionary() {
   try {
      const response = await fetch("assets/scripts/trimmedWords.json");
      const data = await response.json();
      //console.log(data);
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

function readPlayerGuess() {
   let guess = "";
   guessInputs.forEach((guessCharacter) => {
      guess += guessCharacter.value.toUpperCase();
   });
   return guess;
}

function validateGuess(guess) {
   let validGuess = false;
   if (guess.length === 4) {
      const matchingLetters = checkForMatchingLetters(guess);
      const previouslyGuessed = checkIfPreviouslyGuessed(guess);

      if (matchingLetters && !previouslyGuessed) {
         validGuess = true;
      }
      if (validGuess) {
         console.log("valid guess");
         recordSuccessfulGuess(guess);
      } else {
         console.log(
            "invalid guess: does not follow game rules. Guess: " +
               guess +
               " prev: " +
               lastGuess
         );
         //gameOver(matchingLetters, previouslyGuessed);
         indicateInvalidEntry();
      }
   } else {
      console.log("4 characters not entered");
   }
}

function checkForMatchingLetters(guess) {
   let matchingLetters = 0;
   for (let i = 0; i < lastGuess.length; i++) {
      const character = lastGuess[i];
      if (character === guess[i]) {
         console.log("matching letter found");
         matchingLetters++;
      }
   }
   if (matchingLetters === 3) {
      return true;
   } else {
      return false;
   }
}

function checkIfPreviouslyGuessed(guess) {
   let previouslyGuessed = false;
   previousGuesses.forEach((previousGuess) => {
      if (guess === previousGuess) {
         previouslyGuessed = true;
      }
   });
   console.log("Previously guessed: " + previouslyGuessed);
   return previouslyGuessed;
}

function checkDictionary(guess) {
   //console.log(guessInputs);
   //console.log(guess.length);
   let matchFound = false;
   if (guess.length === 4) {
      dictionary.forEach((word) => {
         //console.log(word);
         if (guess === word) {
            //console.log("match found!");
            matchFound = true;
         }
      });
   } else {
      console.log("4 characters not detected");
   }
   if (matchFound) {
      console.log("disctionary match found for " + guess);
      validateGuess(guess);
   } else {
      console.log("match not found");
      indicateInvalidEntry();
   }

   clearInputs();
}

function indicateInvalidEntry() {
   const gameContainer = document.querySelector(".gameContainer");
   document.body.classList.add("vibrate");
   setTimeout(() => {
      document.body.classList.remove("vibrate");
   }, 500);
}

function recordSuccessfulGuess(guess) {
   if (!invalidGuessIndicator.classList.contains("hide")) {
      invalidGuessIndicator.classList.add("hide");
   }
   score++;
   updatePrintedScore(score);
   previousGuesses.push(guess);
   lastGuess = guess;
   logLastGuess(guess);
   checkForHighScore();
   checkForLevelComplete();
}

function checkForLevelComplete() {
   if (lastGuess === targetWord) {
      level++;
      updatePrintedLevel();
      randomizeStartingWord();
      randomizeTargetWord();
      logLastGuess("");
   }
}

function updatePrintedLevel() {
   const levelIndicator = document.getElementById("level");
   levelIndicator.innerText = level;
}

function checkForHighScore() {
   const highScoreKey = "highScore";
   if (localStorage.getItem(highScoreKey) !== null) {
      const highScore = localStorage.getItem(highScoreKey);
      console.log("saved high score found: " + highScore);
      if (score > highScore) {
         console.log("new high score!");
         localStorage.setItem(highScoreKey, score);
         updatePrintedHighScore();
      }
   } else {
      console.log("no high score found");
      localStorage.setItem("highScore", score);
   }
}

function updatePrintedHighScore() {
   const highScore = localStorage.getItem("highScore");
   const highScoreHolder = document.getElementById("highScore");
   highScoreHolder.innerText = highScore;
}
//handles all the logic to populate the game over screen
//and hide the game
//also handles the logic to start a new game when the play again button is clicked
function gameOver(matchingLetters, previouslyGuessed) {
   console.warn("Game Over");
   let reason = "";
   if (!matchingLetters) {
      reason = "Each guess must match 3 letters from the previous guess. ";
   }
   if (previouslyGuessed) {
      reason += "You may not repeat previously used words.";
   }
   console.log(reason);
   console.log(matchingLetters + " " + previouslyGuessed);
   const gameOverReason = document.getElementById("gameOverReason");
   gameOverReason.innerText = reason;

   const gameOverElement = document.getElementById("gameOver");
   gameOverElement.classList.remove("hide");

   const gameContainer = document.querySelector(".gameContainer");
   gameContainer.classList.add("hide");

   const playAgainButton = document.getElementById("playAgainButton");
   playAgainButton.addEventListener("click", function () {
      previousGuesses = [];
      score = 0;
      updatePrintedScore(score);
      selectFirstInput();
      clearInputs();
      randomizeStartingWord();
      randomizeTargetWord();
      gameContainer.classList.remove("hide");
      gameOverElement.classList.add("hide");
      if (!invalidGuessIndicator.classList.contains("hide")) {
         invalidGuessIndicator.classList.add("hide");
      }
   });
}

function updatePrintedScore(val) {
   scoreHolder.innerText = val;
}

function clearInputs() {
   console.log("clearing inputs");
   guessInputs.forEach((guessCharacter) => {
      guessCharacter.value = "";
   });
   selectFirstInput();
}

function selectFirstInput() {
   const nextInput = document.getElementById(`0`);
   console.log(nextInput);
   if (nextInput) {
      nextInput.focus();
   }
}

function logLastGuess(lastGuess) {
   console.log("Logging: " + lastGuess);
   //lastGuessHolder.innerText = lastGuess;
   updateTopCharacters(lastGuess);
}

function getRandomInt(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomizeStartingWord() {
   const rndLendth = dictionary.length;
   const startingWordIndex = getRandomInt(0, rndLendth);
   const startingWord = dictionary[startingWordIndex];
   const possibleConnections = findAllPossibleNextWords(startingWord);
   const minimumConnections = 15; //randomized word must connect to at least this many other words to be a valid selection
   console.log(dictionary[startingWordIndex]);
   console.log("Possible connections:"  + possibleConnections.length)
   if (possibleConnections.length > minimumConnections) {
      
      //const startingWordIndicator = document.getElementById("startingWord");
      //startingWordIndicator.innerText = startingWord;
      console.log("accepting starting word");
      updateTopCharacters(startingWord);
      lastGuess = startingWord;
      randomizeTargetWord();
   } else {
      console.log("rerolling starting word...")
      randomizeStartingWord();
   }
}

function randomizeTargetWord() {
   let currentTarget = lastGuess;
   let nextPossibleTargets = [];
   let pastLinksToTarget = [];
   const linksToTraverse = 5;
   for (let i = 0; i < linksToTraverse; i++) {
      nextPossibleTargets = findAllPossibleNextWords(currentTarget);
      console.log(nextPossibleTargets);
      currentTarget = selectNextWordLink(
         pastLinksToTarget,
         nextPossibleTargets
      );
      pastLinksToTarget.push(currentTarget);
      console.log("Selected: " + currentTarget);
   }
   console.log(currentTarget)
   updateBottomCharacters(currentTarget);
   const solvableInfo = document.getElementById("solvableInfo")
   solvableInfo.innerText = `Solvable in ${linksToTraverse} moves`
}

function selectNextWordLink(pastLinksToTarget, nextPossibleTargets) {
   const rnd = getRandomInt(0, nextPossibleTargets.length - 1);
   console.log("Rnd: " + rnd);
   const nextLink = nextPossibleTargets[rnd];
   console.log("past: " + pastLinksToTarget);
   console.log("nextLink: " + nextLink);
   if (!pastLinksToTarget.includes(nextLink)) {
      console.log("returning " + nextLink)
      return nextLink;
   } else {
      console.log("past links already contains " + nextLink + " not returning")
      selectNextWordLink(pastLinksToTarget, nextPossibleTargets);
   }
}

function walkDownToNextPossibility(searchString) {
   return (possibleNextWords = findAllPossibleNextWords(searchString));
}

function findAllPossibleNextWords(currentWord) {
   console.log(currentWord);

   const alphabet = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
   ];
   let automatedMatches = [];

   for (let guessLetter = 0; guessLetter < 4; guessLetter++) {
      let tmpString = currentWord;
      //console.log("changing " + lastGuess[guessLetter])
      for (
         let changeLetter = 0;
         changeLetter < alphabet.length;
         changeLetter++
      ) {
         tmpString = replaceCharacter(
            tmpString,
            guessLetter,
            alphabet[changeLetter]
         );
         //console.log("swapping in a " + alphabet[changeLetter] + " Result: " + tmpString)
         if (dictionaryLookup(tmpString)) {
            //console.log("adding " + tmpString)
            if (
               !automatedMatches.includes(tmpString) &&
               tmpString !== currentWord
            ) {
               automatedMatches.push(tmpString);
            }
         }
      }
   }
   console.log("Automated Matches Found: " + automatedMatches);
   return automatedMatches;
}

function replaceCharacter(str, index, newChar) {
   return str.substring(0, index) + newChar + str.substring(index + 1);
}

function dictionaryLookup(value) {
   return dictionary.some((word) => word === value);
}

//above the user input boxes, we'll show the starting word initially
//and then the last word subsequently
function updateTopCharacters(value) {
   const startingWordIndicator = document.getElementById("startingWord");
   startingWordIndicator.innerHTML = "";
   for (let i = 0; i < value.length; i++) {
      const template = `<div class="character">${value[i]}</div>`;
      startingWordIndicator.innerHTML += template;
   }
}

function updateBottomCharacters(value) {
   const targetWordIndicator = document.getElementById("targetWord");
   targetWordIndicator.innerHTML = "";
   for (let i = 0; i < 4; i++) {
      const template = `<div class="character">${value[i]}</div>`;
      targetWordIndicator.innerHTML += template;
   }
}

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
   if (event.key === "Enter") {
      //on the first guess, we just check to see if the word is valid
      //but on subsequent guesses, the guess first has to fit the rules of the game
      //i.e. 3 of 4 letters must be the same
      checkDictionary(readPlayerGuess());
   }
   if (event.key === "`") {
      findAllPossibleNextWords();
   }
});

const inputFields = document.querySelectorAll(".guessInput");
inputFields.forEach((input) => input.addEventListener("keyup", handleInput));

const dictionary = await loadDictionary();
console.log(dictionary);

if (localStorage.getItem("highScore") !== null) {
   updatePrintedHighScore();
}

randomizeStartingWord();
