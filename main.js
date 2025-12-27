let themeBtn = document.getElementById("theme-btn");
let root = document.documentElement;
let textBox = document.getElementById("textBox");
let divCharacters = document.getElementById("char");
let divWords = document.getElementById("word");
let divSentences = document.getElementById("sentence");

let excludeSpacesCheck = document.getElementById("exclude-spaces");
let setCharsLimit = document.getElementById("set-limit");
let limitCharsInput = document.getElementById("limit-char-input");

let seeMoreBtn = document.getElementById("see-more");
let seeLessBtn = document.getElementById("see-less");
let noLettersFoundPar = document.getElementById("no-letters-found-p");

let defaultTheme = localStorage.getItem("theme");
if (defaultTheme) {
  root.classList.add(defaultTheme);
}

themeBtn.addEventListener("click", () => {
  if (root.classList.contains("light")) {
    root.classList.remove("light");
    localStorage.setItem("theme", "");
  } else {
    root.classList.add("light");
    localStorage.setItem("theme", "light");
  }
});

let regExSpaces = /\s/g;
let originalText = textBox.value;

excludeSpacesCheck.addEventListener("change", () => {
  if (excludeSpacesCheck.checked) {
    textBox.value = textBox.value.replace(regExSpaces, "");
  } else if (!excludeSpacesCheck.checked && textBox.value.length === 0) {
    originalText = "";
  } else {
    textBox.value = originalText;
  }
});

// Checkbox (Set Characters Limit)
setCharsLimit.addEventListener("change", () => {
  if (setCharsLimit.checked) {
    limitCharsInput.style.visibility = "visible";
  } else {
    limitCharsInput.style.visibility = "hidden";
    textBox.removeAttribute("maxlength");
    limitCharsInput.value = "";
    textBox.value = originalText.slice(0);
  }
});

// Input (Set Characters Limit)
limitCharsInput.addEventListener("input", () => {
  let textareaMaxLength = limitCharsInput.value;

  if (limitCharsInput.value.length > 4) {
    limitCharsInput.value = limitCharsInput.value.slice(0, 4);
  }

  textBox.setAttribute("maxlength", textareaMaxLength);
  if (originalText.length > textareaMaxLength) {
    textBox.value = originalText.slice(0, textareaMaxLength);
  } else {
    textBox.value = originalText.slice(0);
  }
});

textBox.addEventListener("input", () => {
  if (!excludeSpacesCheck.checked) {
    originalText = textBox.value;
  }

  // First Counting Characters

  let noSpacesText = textBox.value.replace(regExSpaces, "");
  let charsCount = noSpacesText.length;
  if (charsCount < 10) {
    divCharacters.innerHTML = `<h1> 0${charsCount}</h1><h4>Characters Count</h4>`;
  } else {
    divCharacters.innerHTML = `<h1>${charsCount}</h1><h4>Characters Count</h4>`;
  }

  // Second Counting Words
  let text = textBox.value.trim();
  let arrayOfWords = text.split(/\s+/).filter(Boolean);
  let wordsCount = arrayOfWords.length;
  if (wordsCount < 10) {
    divWords.innerHTML = `<h1> 0${wordsCount}</h1><h4>Words Count</h4>`;
    if (charsCount === 0) {
      divWords.innerHTML = `<h1>00</h1><h4>Words Count</h4>`;
    }
  } else {
    divWords.innerHTML = `<h1>${wordsCount}</h1><h4>Words Count</h4>`;
  }

  // Third Counting Sentences
  let sentenceRegEx = /[!.?]+/;
  let arrayOfSentences = text
    .split(sentenceRegEx)
    .filter((s) => s.trim().length > 0);
  let sentencesCount = arrayOfSentences.length;

  if (sentencesCount < 10) {
    divSentences.innerHTML = `<h1> 0${sentencesCount}</h1><h4>Sentences Count</h4>`;
    if (charsCount === 0) {
      divSentences.innerHTML = `<h1>00</h1><h4>Sentences Count</h4>`;
    }
  } else {
    divSentences.innerHTML = `<h1>${sentencesCount}</h1><h4>Sentences Count</h4>`;
  }

  // Counter For Every Letter
  let cardsContainer = document.getElementById("d-container");
  let countLetters = {};

  cardsContainer.innerHTML = "";
  let regExSymbols = /[^a-zA-Z]/;
  // This Loop Is For Adding Keys And Values To Object
  for (let char of noSpacesText.toUpperCase()) {
    countLetters[char] = (countLetters[char] || 0) + 1;
    if (regExSymbols.test(char)) {
      delete countLetters[char];
    }
  }

  // Sorting Densities
  let sortedCards = Object.entries(countLetters).sort((a, b) => b[1] - a[1]);

  // Setting Limit For Rendering Densities
  let limit = 4;

  const renderDensities = (key, value) => {
    let card = document.createElement("div");
    let letterSpan = document.createElement("span");
    let barDiv = document.createElement("div");
    let fillDiv = document.createElement("div");
    let percentageSpan = document.createElement("span");
    let percent = Math.floor((value / charsCount) * 100);

    card.classList.add("density-card");
    letterSpan.classList.add("letter");
    barDiv.classList.add("bar");
    fillDiv.classList.add("fill");
    percentageSpan.classList.add("percentage");

    letterSpan.textContent = key;
    fillDiv.style.width = `${percent}%`;
    percentageSpan.textContent = `${value}(${percent}%)`;

    barDiv.appendChild(fillDiv);
    card.appendChild(letterSpan);
    card.appendChild(barDiv);
    card.appendChild(percentageSpan);
    cardsContainer.appendChild(card);
  };

  // This Loop Is For Adding Object Keys And Values To DOM (Letters and Count)
  sortedCards.slice(0, limit).forEach(([key, value]) => {
    renderDensities(key, value);
  });

  if (sortedCards.length > limit) {
    noLettersFoundPar.style.display = "none";
    seeMoreBtn.style.display = "block";

    seeMoreBtn.addEventListener("click", () => {
      // const restOfCards = sortedCards.slice(limit);
      cardsContainer.innerHTML = "";
      sortedCards.forEach(([key, value]) => {
        renderDensities(key, value);
      });
      seeMoreBtn.style.display = "none";
      seeLessBtn.style.display = "block";
    });

    seeLessBtn.addEventListener("click", () => {
      cardsContainer.innerHTML = "";
      const slicedCards = sortedCards.slice(0, limit);
      slicedCards.forEach(([key, value]) => {
        renderDensities(key, value);
      });
      seeLessBtn.style.display = "none";
      seeMoreBtn.style.display = "block";
    });
  } else if (sortedCards.length === 0) {
    noLettersFoundPar.style.display = "block";
    seeMoreBtn.style.display = "none";
  } else {
    noLettersFoundPar.style.display = "none";
    seeMoreBtn.style.display = "none";
  }
});
