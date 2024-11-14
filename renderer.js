const button = document.getElementById('btn')
const input = document.getElementById('input')
const info = document.getElementById('info')

button.addEventListener('click', () => {
  console.log('Button clicked')

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
// recognition.maxAlternatives = 1;
//   recognition.onresult = (event) => {
//     const transcript = event.results[0][0].transcript;
//     console.log(`Recognized Speech: ${transcript}`);
//     input.value = transcript;
//   };
// recognition.start();

  // focus on the input field
  input.focus()

  // type the message
  electronAPI.typeMessage("hello world")
})

// listen for the update-info-text event
electronAPI.updateInfoText((value) => {
  info.innerText = value
})

