//Init speechSynth api
const synth = window.speechSynthesis;

//DOM Elements
const textForm = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");
const animation = document.querySelector("#animation");

//Init voices array
let voices = [];

//Following code gets different voices.
const getVoices = () => {
  voices = synth.getVoices();
  //loop through voices and create an option for each one.
  voices.forEach(voice => {
    //create an option element
    const option = document.createElement("option");
    //Fill option with voice and language
    option.textContent = voice.name + "(" + voice.lang + ")";
    //Set needed option attributes
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);
    //Appends option to the select list.
    voiceSelect.appendChild(option);
  });
};

getVoices();
//Following conditional must be used in order to obtain the voices.
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

//Following code makes app speak.
const speak = () => {
  //check if speaking
  if (synth.speaking) {
    console.error("Already speaking");
    return;
  }
  //check to see input is not empty.
  if (textInput.value !== "") {
    //Add animation
    animation.style.visibility = "visible";
    //Get to speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);
    //Speak end
    speakText.onend = e => {
      animation.style.visibility = "hidden";
      console.log("Finished speaking...");
    };
    //Speak error
    speakText.onerror = e => {
      console.log("Something is wrong!");
    };
    //Selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      "data-name"
    );
    //loop through voices
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });
    //Set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;
    //Speak
    synth.speak(speakText);
  }
};

//EVENT LISTENERS

//Text form submit
textForm.addEventListener("submit", e => {
  e.preventDefault();
  speak();
  textInput.blur();
});
//Rate value change
rate.addEventListener("change", e => (rateValue.textContent = rate.value));
//Pitch value change
pitch.addEventListener("change", e => (pitchValue.textContent = pitch.value));
//Voice select change
voiceSelect.addEventListener("change", e => speak());
