let gameData;
const main = document.querySelector('main');
const pokemonImage = document.querySelector('#pokemon-image');
const textOverlay = document.querySelector('#text-overlay');
const choices = document.querySelector('#choices');
const playBtn = document.querySelector('#play');
const iPoints = document.querySelector('#points');
let count = 0;
playBtn.addEventListener('click', fetchData);
loadVoice();
addAnswerHandler();


async function fetchData() {
  resetImage();
  gameData = await window.getPokeData();
  showSilhouette();
  displayChoices();
}

function resetImage() {
  pokemonImage.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';
  main.classList.add('fetching');
  main.classList.remove('revealed');
}

function showSilhouette() {
  main.classList.remove('fetching');
  pokemonImage.src = gameData.correct.image;
}

function displayChoices() {
  const { pokemonChoices } = gameData;
  const choicesHTML = pokemonChoices.map(({ name }) => {
    return `<button data-name="${name}">${name}</button>`;
  }).join('');
  choices.removeAttribute("style","display:none;");
  choices.innerHTML = choicesHTML;
}

function addAnswerHandler() {
  choices.addEventListener('click', e => {
    const { name } = e.target.dataset;
    let resultClass = (name === gameData.correct.name) ?
      'correct' : 'incorrect';

    e.target.classList.add(resultClass);
   
    (resultClass === 'correct') ? count++ : count--;
    iPoints.innerText = `Pontuação: ${count}`;
    choices.setAttribute("style","display:none;");
    revealPokemon();
    speakAnswer();
  });
  
}
choices.addEventListener('click', first);


function revealPokemon() {
  main.classList.add('revealed');
  textOverlay.textContent = `${gameData.correct.name}!`;
}

function loadVoice() {
  window.speechSynthesis.onvoiceschanged = () => {
    window.femaleVoice = speechSynthesis.getVoices()[8];
  };
}

function speakAnswer() {
  const utterance = new SpeechSynthesisUtterance(gameData.correct.name);
  utterance.voice = window.femaleVoice;
  utterance.pitch = 0.9;
  utterance.rate = 0.85;
  speechSynthesis.speak(utterance);
}
