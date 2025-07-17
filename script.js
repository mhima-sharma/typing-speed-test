const paragraphText =
  "The quick brown fox jumps over the lazy dog. Typing tests help improve your speed and accuracy. Focus on each word and try not to make mistakes. Practice every day to become faster and more confident. Consistency is the key to mastering any skill.";

const paragraphEl = document.getElementById("paragraph");
const inputEl = document.getElementById("input");
const timerEl = document.getElementById("timer");
const wpmEl = document.getElementById("wpm");
const mistakesEl = document.getElementById("mistakes");
const startBtn = document.getElementById("start-btn");
const gif = document.getElementById("status-gif");

const gifIdle = "https://media.giphy.com/media/xUPGcgtKxm3G8uVZYA/giphy.gif";      // Idle (before typing)
const gifTyping = "https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif";    // Typing in progress
const gifEnd = "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif";       // Test complete

let timeLeft = 60;
let timer = null;
let charIndex = 0;
let mistakes = 0;
let isTyping = false;

function displayParagraph() {
  paragraphEl.innerHTML = "";
  paragraphText.split("").forEach((char) => {
    const span = document.createElement("span");
    span.innerText = char;
    paragraphEl.appendChild(span);
  });
}

function startTimer() {
  if (timer) clearInterval(timer);
  timeLeft = 60;
  timerEl.innerText = `Time Left: ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.innerText = `Time Left: ${timeLeft}s`;

    if (timeLeft === 0) {
      endTest();
    }

    updateStats();
  }, 1000);
}

function endTest() {
  clearInterval(timer);
  inputEl.disabled = true;
  startBtn.disabled = false;
  gif.src = gifEnd;
}

function updateStats() {
  const typedChars = charIndex;
  const wpm = Math.round((typedChars / 5) / ((60 - timeLeft) / 60));
  wpmEl.innerText = wpm > 0 ? wpm : 0;
  mistakesEl.innerText = mistakes;
}

function handleTyping() {
  const characters = paragraphEl.querySelectorAll("span");
  const typedValue = inputEl.value.split("")[charIndex];

  if (!isTyping) {
    startTimer();
    isTyping = true;
    gif.src = gifTyping;
  }

  if (charIndex < characters.length) {
    if (typedValue == null) {
      // Backspace
      if (charIndex > 0) {
        charIndex--;
        if (characters[charIndex].classList.contains("incorrect")) {
          mistakes--;
        }
        characters[charIndex].classList.remove("correct", "incorrect");
      }
    } else {
      if (typedValue === characters[charIndex].innerText) {
        characters[charIndex].classList.add("correct");
      } else {
        characters[charIndex].classList.add("incorrect");
        mistakes++;
      }
      charIndex++;
    }
  }

  updateStats();
}

startBtn.addEventListener("click", () => {
  inputEl.value = "";
  inputEl.disabled = false;
  inputEl.focus();
  charIndex = 0;
  mistakes = 0;
  isTyping = false;
  wpmEl.innerText = 0;
  mistakesEl.innerText = 0;
  gif.src = gifIdle;
  displayParagraph();

  paragraphEl.scrollTop = 0;
  paragraphEl.scrollLeft = 0;
});

inputEl.addEventListener("input", handleTyping);

// Load default
displayParagraph();
