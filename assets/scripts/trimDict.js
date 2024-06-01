console.log("trim");

async function loadDictionary() {
   try {
      const response = await fetch("assets/BasicEnglish.TXT");
      const data = await response.text();
      //console.log(data);
      return data;
   } catch {}
}

function saveAsJson(wordArray) {
   const jsonString = JSON.stringify(wordArray, null, 2);
   const blob = new Blob([jsonString], { type: "aplication/json" });
   const url = URL.createObjectURL(blob);
   const link = document.createElement("a");
   link.href = url;
   link.download = "trimmed_words.json"
   link.click();
   
}

const wordString = await loadDictionary();
const wordArray = wordString.split(/\r?\n/);
let trimmedWords = [];

console.log(wordArray);
wordArray.forEach((word) => {
   if (word.length === 4) {
      const upperCaseWord = word.toUpperCase();
      trimmedWords.push(upperCaseWord);
   }
});

saveAsJson(trimmedWords)
console.log(trimmedWords);
