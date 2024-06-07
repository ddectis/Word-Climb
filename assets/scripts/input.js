console.log("input module loaded");

export default class InputScroll {
   constructor(targetId) {
      this.targetId = targetId;
      this.inputTarget = document.getElementById(targetId);
      this.intervalId = 0;
      this.isMouseDown = false;
      this.isTouchTown = false;
      this.currentY = 0;
      this.initialY = 0;
      this.deltaY = 0;
      this.changeLetterThreshold = 15;

      this.bindEvents();
   }

   bindEvents() {
      this.inputTarget.addEventListener(
         "mousedown",
         this.onMouseDown.bind(this)
      );
      document.addEventListener("mouseup", this.onMouseUp.bind(this));
      document.addEventListener("mousemove", this.onMouseMove.bind(this));
      document.addEventListener("mouseleave", this.onMouseUp.bind(this));
      this.inputTarget.addEventListener(
         "touchstart",
         this.onTouchStart.bind(this)
      );
      document.addEventListener("touchend", this.onTouchEnd.bind(this));
      document.addEventListener("touchmove", this.onTouchMove.bind(this));
   }

   changeCurrentLetter(direction, letter) {
      //console.log("Changing letter ", direction);
      //console.log("Letter: ", letter);
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

      let currentLetterIndex;
      let nextLetterIndex;
      for (let i = 0; i < 26; i++) {
         if (alphabet[i] === letter) {
            currentLetterIndex = i;
         }
      }

      nextLetterIndex = currentLetterIndex + direction;

      if (nextLetterIndex < 0) {
         nextLetterIndex = alphabet.length - 1;
      }
      if (nextLetterIndex >= alphabet.length) {
         nextLetterIndex = 0;
      }

      //console.log("letter index ", nextLetterIndex);
      const newLetter = alphabet[nextLetterIndex];
      this.inputTarget.innerText = newLetter;
   }

   onMouseDown(event) {
      //console.log("click on ", this.inputTarget);
      this.isMouseDown = true;
      this.initialY = event.clientY;
      event.preventDefault();
      //this.inputTarget.focus();
   }

   onMouseUp() {
      //console.log("mouse up");
      this.isMouseDown = false;
   }

   onMouseMove(event) {
      if (this.isMouseDown) {
         //console.log("mouse move");
         this.currentY = event.clientY;
         this.deltaY = this.initialY - this.currentY;
         //console.log("Delta:", this.deltaY)
         const letter = this.inputTarget.innerText.toUpperCase();
         //console.log("letter", letter);
         if (this.deltaY > this.changeLetterThreshold) {
            //console.log("selecting new letter +");
            this.changeCurrentLetter(1, letter);
            this.initialY = event.clientY;
         }
         if (this.deltaY < -this.changeLetterThreshold) {
            //console.log("selecting new letter -");
            this.initialY = event.clientY;
            this.changeCurrentLetter(-1, letter);
         }
      }
   }

   onTouchStart(event) {
      console.log("touch start");

      const touch = event.touches[0];
      if (touch.target === this.inputTarget) {
         this.isTouchTown = true;
         this.initialY = touch.clientY;
         event.preventDefault();
      }
   }

   onTouchEnd(event) {
      console.log("touch end");
      this.isTouchTown = false;
   }

   onTouchMove(event) {
      if (this.isTouchTown) {
         console.log("touch moving");
         const touch = event.touches[0];
         this.currentY = touch.clientY;
         this.deltaY = this.initialY - this.currentY;
         const letter = this.inputTarget.innerText.toUpperCase();
         console.log("letter", letter);
         if (this.deltaY > this.changeLetterThreshold) {
            console.log("selecting new letter +");
            this.changeCurrentLetter(1, letter);
            this.initialY = touch.clientY + window.scrollY; // Add window.scrollY to get the global y-coordinate
         }
         if (this.deltaY < -this.changeLetterThreshold) {
            console.log("selecting new letter -");
            this.changeCurrentLetter(-1, letter);
            this.initialY = touch.clientY + window.scrollY; // Add window.scrollY to get the global y-coordinate
         }
      }
   }
}
