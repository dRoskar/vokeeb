// const button = document.getElementById('btn')
// const input = document.getElementById('input')
// const info = document.getElementById('info')

const btnModelGoogle = document.getElementById('google')
const btnModelWebSpeech = document.getElementById('web-speech')
btnModelWebSpeech.disabled = true
const btnModelUniversal2 = document.getElementById('universal-2')
btnModelUniversal2.disabled = true

const btnWord = document.getElementById('word')
const btnSentence = document.getElementById('sentence')
const btnDictation = document.getElementById('dictation')
btnDictation.disabled = true

btnWord.addEventListener('click', () => {
  vokeebAPI.startListening(getSelectedModel(), 'word')
})

btnSentence.addEventListener('click', () => {
  vokeebAPI.startListening(getSelectedModel(), 'sentence')
})

btnDictation.addEventListener('click', () => {
  vokeebAPI.startListening(getSelectedModel(), 'dictation')
})

function getSelectedModel() {
  return btnModelGoogle.checked ? 'google' : btnModelWebSpeech.checked ? 'web-speech' : 'universal-2'
}
// button.addEventListener('click', () => {
//   console.log('Button clicked')

//   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   const recognition = new SpeechRecognition();
//   recognition.continuous = false;
//   recognition.lang = 'en-US';
//   recognition.interimResults = false;
// recognition.maxAlternatives = 1;
//   recognition.onresult = (event) => {
//     const transcript = event.results[0][0].transcript;
//     console.log(`Recognized Speech: ${transcript}`);
//     input.value = transcript;
//   };
// recognition.start();

  // focus on the input field
  // input.focus()

  // type the message
  // electronAPI.typeMessage("hello world")
// })

// listen for the update-info-text event
// electronAPI.updateInfoText((value) => {
//   info.innerText = value
// })

