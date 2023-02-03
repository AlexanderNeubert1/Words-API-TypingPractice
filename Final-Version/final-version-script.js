let currentLetterValue;
let textGenerated = false;
let mainText = "";
let mainTextArray = [];
let generatedText = "";
const textInCenter = document.querySelector('.main-text');
let saveOriginalWord = "";
let firstTry;
let wordCount;
let seconds = 0;
let timerActive = false;
let clearTimer;
let characterCount;
let mistakes = 0;
const letterStatsContainer = document.querySelector('.typing-practice__letter-stats');

const characterStats = document.querySelectorAll(".characterStats");
const alphabetArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const lastLettersTyped = new Array(26);
const lastLettersCorrect = new Array(26);

const currentDate = new Date().getDate() + "." + new Date().getMonth() + "." + new Date().getFullYear();
const apiUrl = "http://localhost:5062/random-word-list/amount=";

function timer() {
  seconds++;
}

const statsTextGlobalSets = document.getElementById('statsTextGlobalSets');
const statsTextGlobalCpm = document.getElementById('statsTextGlobalCpm');
const statsTextGlobalTime = document.getElementById('statsTextGlobalTime');
const statsTextGlobalRatio = document.getElementById('statsTextGlobalRatio');

function displayTotalStats() {
  const totalStatsDeleted = localStorage.globalSets == undefined || localStorage.globalCharacterCount == NaN || localStorage.globalTime == undefined || localStorage.globalMistakes == NaN;
  if (!totalStatsDeleted) {
    const globalCPM = parseFloat((localStorage.globalCharacterCount / localStorage.globalTime) * 60).toFixed(2);
    const globalMistakesRatio = parseFloat((100 / localStorage.globalCharacterCount) * localStorage.globalMistakes).toFixed(2);

    statsTextGlobalSets.innerHTML = localStorage.globalSets;
    statsTextGlobalCpm.innerHTML = globalCPM;
    statsTextGlobalTime.innerHTML = localStorage.globalTime;
    statsTextGlobalRatio.innerHTML = globalMistakesRatio;
  }
  else {
    statsTextGlobalSets.innerHTML = '_';
    statsTextGlobalCpm.innerHTML = '_';
    statsTextGlobalTime.innerHTML = '_';
    statsTextGlobalRatio.innerHTML = '_';
  }
}

function displayDailyStats() {
  const currentDateDifferentFromSavedDate = localStorage.savedDate != currentDate;
  if (currentDateDifferentFromSavedDate) {
    localStorage.savedDate = currentDate;
    localStorage.removeItem("dailySets");
    localStorage.removeItem("dailyCharacterCount");
    localStorage.removeItem("dailyTime");
    localStorage.removeItem("dailyMistakes");
  }

  const dailyStatsDeleted = localStorage.dailySets == undefined || localStorage.dailyCharacterCount == NaN || localStorage.dailyTime == undefined || localStorage.dailyMistakes == NaN;
  if (!dailyStatsDeleted) {
    const dailyCPM = parseFloat((localStorage.dailyCharacterCount / localStorage.dailyTime) * 60).toFixed(2);
    const dailyMistakesRatio = parseFloat((100 / localStorage.dailyCharacterCount) * localStorage.dailyMistakes).toFixed(2);

    document.getElementById('statsTextDailySets').innerHTML = localStorage.dailySets;
    document.getElementById('statsTextDailyChars').innerHTML = localStorage.dailyCharacterCount;
    document.getElementById('statsTextDailyCpm').innerHTML = dailyCPM;
    document.getElementById('statsTextDailyTime').innerHTML = localStorage.dailyTime;
    document.getElementById('statsTextDailyMistakes').innerHTML = dailyMistakesRatio;
  }
  else {
    document.getElementById('statsTextDailySets').innerHTML = '_';
    document.getElementById('statsTextDailyChars').innerHTML = '_';
    document.getElementById('statsTextDailyCpm').innerHTML = '_';
    document.getElementById('statsTextDailyTime').innerHTML = '_';
    document.getElementById('statsTextDailyMistakes').innerHTML = '_';
  }
}

function displayLetterStats() {
  const letterStatsDeleted = localStorage.globalLettersTyped == undefined || localStorage.globalLettersCorrect == undefined;
  if (letterStatsDeleted) {
    for (const slot of characterStats) {
      slot.innerHTML = "_";
    }
  }
  else {
    let index = 0;
    const displayTypedLetters = new Array(26);
    const displayCorrectLetters = new Array(26);

    for (const character of localStorage.globalLettersTyped) {
      if (character == ",") {
        index++;
      }
      else {
        const arraySlotEmpty = displayTypedLetters[index] == undefined
        if (arraySlotEmpty) {
          displayTypedLetters[index] = character;
        }
        else {
          displayTypedLetters[index] += character;
        }
      }
    }

    index = 0;
    for (const character of localStorage.globalLettersCorrect) {
      if (character == ",") {
        index++;
      }
      else {
        const arraySlotEmpty = displayCorrectLetters[index] == undefined;
        if (arraySlotEmpty) {
          displayCorrectLetters[index] = character;
        }
        else {
          displayCorrectLetters[index] += character;
        }
      }
    }

    index = 0;
    for (const slot of characterStats) {
      const letterNotUsed = displayTypedLetters[index] == "0" && displayCorrectLetters[index] == "0";
      if (letterNotUsed) {
        slot.innerHTML = "_";
      }
      else {
        slot.innerHTML = parseFloat((100 / parseInt(displayTypedLetters[index])) * parseInt(displayCorrectLetters[index])).toFixed(2);
      }
      index++;
    }
  }
}

function displayStats() {
  lastLettersTyped.fill(0);
  lastLettersCorrect.fill(0);

  displayTotalStats();
  displayDailyStats();
  displayLetterStats();
}

function underlineNextFreeCharacter() {
  const maximumCharactersReached = currentLetterIndex == saveOriginalWord.length;
  if (maximumCharactersReached) {
    return
  }

  mainTextArray[currentLetterIndex] = '<span style="text-decoration: underline blue">' + mainTextArray[currentLetterIndex] + '</span>';
}

function displayTypingText() {
  mainText = String(mainTextArray);
  mainText = mainText.replace(/,/g, "");
  textInCenter.innerHTML = mainText;
}

async function getText(file) {
  const fetchText = await fetch(file);
  let apiText = await fetchText.text();

  apiText = apiText.replace('[', "");
  apiText = apiText.replace(']', "");
  apiText = apiText.replace(/"/g, "");

  return apiText;
}

async function generateText() {
  mainTextArray = [];
  currentLetterIndex = 0;
  seconds = 0;
  timerActive = false;
  clearTimeout(clearTimer);
  mistakes = 0;

  generatedText = await getText(apiUrl + wordCount);
  mainText = generatedText.replace(/,/g, " ");
  characterCount = mainText.length;
  saveOriginalWord = mainText;

  mainTextArray = mainText.split("");

  underlineNextFreeCharacter();
  displayTypingText();
  firstTry = true;
  textGenerated = true;
}

function setTotalStats() {
  const totalStatsDeleted = localStorage.globalSets && localStorage.globalCharacterCount && localStorage.globalTime && localStorage.globalMistakes;
  if (totalStatsDeleted) {
    localStorage.globalSets = Number(localStorage.globalSets) + 1;
    localStorage.globalCharacterCount = Number(localStorage.globalCharacterCount) + characterCount;
    localStorage.globalTime = Number(localStorage.globalTime) + seconds;
    localStorage.globalMistakes = Number(localStorage.globalMistakes) + mistakes;
  }
  else {
    localStorage.globalSets = 1;
    localStorage.globalCharacterCount = characterCount;
    localStorage.globalTime = seconds;
    localStorage.globalMistakes = mistakes;
  }
}

function setDailyStats() {
  const dailyStatsDeleted = localStorage.dailySets && localStorage.dailyCharacterCount && localStorage.dailyTime && localStorage.dailyMistakes;
  if (dailyStatsDeleted) {
    localStorage.dailySets = Number(localStorage.dailySets) + 1;
    localStorage.dailyCharacterCount = Number(localStorage.dailyCharacterCount) + characterCount;
    localStorage.dailyTime = Number(localStorage.dailyTime) + seconds;
    localStorage.dailyMistakes = Number(localStorage.dailyMistakes) + mistakes;
  }
  else {
    localStorage.dailySets = 1;
    localStorage.dailyCharacterCount = characterCount;
    localStorage.dailyTime = seconds;
    localStorage.dailyMistakes = mistakes;
  }
}

function setLetterStats() {
  const letterStatsDeleted = localStorage.globalLettersTyped == undefined || localStorage.globalLettersCorrect == undefined;
  if (letterStatsDeleted) {
    localStorage.globalLettersTyped = "";
    localStorage.globalLettersCorrect = "";

    for (const number of lastLettersTyped) {
      localStorage.globalLettersTyped += number + ",";
    }
    for (const number of lastLettersCorrect) {
      localStorage.globalLettersCorrect += number + ",";
    }
  }
  else {
    const lettersTypedConvertArray = new Array(26);
    let index = 0;

    for (const character of localStorage.globalLettersTyped) {
      if (character == ",") {
        index++;
      }
      else {
        const arraySlotEmpty = lettersTypedConvertArray[index] == undefined;
        if (arraySlotEmpty) {
          lettersTypedConvertArray[index] = character;
        }
        else {
          lettersTypedConvertArray[index] += character;
        }
      }
    }

    index = 0;
    for (const currentValue of lastLettersTyped) {
      lettersTypedConvertArray[index] = parseInt(lettersTypedConvertArray[index]) + currentValue;
      index++;
    }

    localStorage.globalLettersTyped = "";
    for (const number of lettersTypedConvertArray) {
      localStorage.globalLettersTyped += number + ",";
    }

    const lettersCorrectConvertArray = new Array(26);
    index = 0;
    for (const character of localStorage.globalLettersCorrect) {
      if (character == ",") {
        index++;
      }
      else {
        const arraySlotEmpty = lettersCorrectConvertArray[index] == undefined;
        if (arraySlotEmpty) {
          lettersCorrectConvertArray[index] = character;
        }
        else {
          lettersCorrectConvertArray[index] += character;
        }
      }
    }
    
    index = 0;
    for (const currentValue of lastLettersCorrect) {
      lettersCorrectConvertArray[index] = parseInt(lettersCorrectConvertArray[index]) + currentValue;
      index++;
    }
    localStorage.globalLettersCorrect = "";
    for (const number of lettersCorrectConvertArray) {
      localStorage.globalLettersCorrect += number + ",";
    }
  }
}

window.onload = () => {
  displayStats()
  letterStatsContainer.style.display = "none";
};

const newText = document.getElementById('newText');
newText.addEventListener('click', async (event) => {

  newText.blur();

  wordCount = document.querySelector('.word-amount__input').value;
  const notValidNumber = !isNaN(wordCount) && wordCount > 0 && wordCount < 141;
  if (notValidNumber) {
    await generateText();
  }
  else {
    alert("Text Length: must be a positive number! (MAX 140 words)");
  }
});

document.getElementById('resetText').addEventListener('click', function () {
  document.getElementById('resetText').blur();

  if (!textGenerated) {
    return;
  }

  mainText = saveOriginalWord;
  mainTextArray = [];
  currentLetterIndex = 0;
  seconds = 0;
  timerActive = false;
  clearTimeout(clearTimer);
  mistakes = 0;

  mainTextArray = mainText.split("");

  underlineNextFreeCharacter();
  displayTypingText();
  firstTry = true;
  textGenerated = true;
});

window.addEventListener('keypress', async (event) => {
  if (!textGenerated) {
    return;
  }

  if (timerActive == false) {
    clearTimer = setInterval(timer, 1000);
    timerActive = true;
  }

  const setCompleted = currentLetterIndex == saveOriginalWord.length;
  const keypressCorrect = event.key == saveOriginalWord[currentLetterIndex];
  if (setCompleted) {
    await generateText();
  }
  else if (keypressCorrect) {
    alphabetArray.forEach((letter, index, arr) => {
      const alphabetArrayEqualToCurrentLetter = arr[index] == event.key;
      if (alphabetArrayEqualToCurrentLetter) {
        lastLettersTyped[index] = parseInt(lastLettersTyped[index]) + 1;
      }
    });

    if (firstTry) {
      mainTextArray[currentLetterIndex] = '<span style="color: green;">' + saveOriginalWord[currentLetterIndex] + '</span>';

      alphabetArray.forEach((letter, index, arr) => {
        const alphabetArrayEqualToCurrentLetter = arr[index] == event.key;
        if (alphabetArrayEqualToCurrentLetter) {
          lastLettersCorrect[index] = parseInt(lastLettersCorrect[index]) + 1;
        }
      });
    }
    else {
      mainTextArray[currentLetterIndex] = '<span style="color: red;">' + saveOriginalWord[currentLetterIndex] + '</span>';
      mistakes++;
    }
    currentLetterIndex += 1;
    underlineNextFreeCharacter();
    displayTypingText();
    firstTry = true;

    const setCompleted = currentLetterIndex == saveOriginalWord.length;
    if (setCompleted) {
      const lastCPM = parseFloat((characterCount / seconds) * 60).toFixed(2);
      const lastMistakes = parseFloat((100 / characterCount) * mistakes).toFixed(2);

      document.getElementById('statsTextLastTime').innerHTML = seconds;
      document.getElementById('statsTextLastCPM').innerHTML = lastCPM;
      document.getElementById('statsTextLastWrong').innerHTML = lastMistakes;

      setTotalStats();
      setDailyStats();
      setLetterStats();

      displayStats();
      clearTimeout(clearTimer);
    }
  }
  else {
    firstTry = false;
  }
})

const openStatsButton = document.querySelector('.open-stats-button');
const closeStatsButton = document.querySelector('.close-stats-button');
const statsSidebar = document.querySelector('.typing-practice__stats-sidebar');

openStatsButton.addEventListener('click', function () {
  openStatsButton.style.display = "none";
  statsSidebar.style.display = "inline";
});

closeStatsButton.addEventListener('click', function () {
  statsSidebar.style.display = "none";
  openStatsButton.style.display = "inline";
});

document.querySelector('.button--letter-stats').addEventListener('click', function () {
  const letterStatsContainerNotDisplayed = letterStatsContainer.style.display == "none";
  if (letterStatsContainerNotDisplayed) {
    letterStatsContainer.style.display = "block";
  }
  else {
    letterStatsContainer.style.display = "none"
  }
});

document.getElementById('deleteToday').addEventListener('click', () => {
  localStorage.removeItem("dailySets");
  localStorage.removeItem("dailyCharacterCount");
  localStorage.removeItem("dailyTime");
  localStorage.removeItem("dailyMistakes");
  displayStats();
})

document.getElementById('deleteAll').addEventListener('click', () => {
  localStorage.removeItem("globalSets");
  localStorage.removeItem("globalCharacterCount");
  localStorage.removeItem("globalTime");
  localStorage.removeItem("globalMistakes");
  localStorage.removeItem("dailySets");
  localStorage.removeItem("dailyCharacterCount");
  localStorage.removeItem("dailyTime");
  localStorage.removeItem("dailyMistakes");
  localStorage.removeItem("globalLettersTyped");
  localStorage.removeItem("globalLettersCorrect");
  displayStats();
})
