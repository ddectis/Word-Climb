console.log("dictionaryAPI loading...");
export default class DictionaryAPI {
   constructor() {
      this.url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
   }

   async fetchDefinition(word) {
      const response = await fetch(this.url + word);
      if (!response.ok) {
         console.error("error with the definition fetch");
      }
      const data = await response.json();
      console.log(data[0].meanings);
      return data[0].meanings;
   }
   catch(error) {
      console.error("Problem with definition fetch", error);
   }
}
