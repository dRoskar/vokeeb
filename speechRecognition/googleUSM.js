const recorder = require('node-record-lpcm16');
const speech = require('@google-cloud/speech');
const { Hardware } = require('keysender');

const speechClient = new speech.SpeechClient();
const ks = new Hardware();

const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

const queue = [];
let isProcessing = false;

async function startSpeechRecognition(mode) {
  const request = {
    config: {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
      // enableSpokenPunctuation: true,
      // model: mode === 'word' ? 'latest_short' : 'latest_long',
      // model: 'latest_short',
      model: 'latest_long',
    },
    singleUtterance: mode === 'dictation' ? false : true,
    interimResults: false,
  };

  const recognizeStream = speechClient
    .streamingRecognize(request)                  
    .on('error', console.error)
    .on('data', data => {
      process.stdout.write(
        data.results[0] && data.results[0].alternatives[0]
          ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
          : '\n\nReached transcription time limit, press Ctrl+C\n'
      )

      // Add to a queue of words
      if(data.results[0] && data.results[0].alternatives[0])
        addToQueue(data.results[0].alternatives[0].transcript);
    });

  const recording = recorder.record({
    sampleRateHertz: sampleRateHertz,
    threshold: 0,
    verbose: false,
    silence: '10',
    // keepSilence: false,
    recordProgram: 'rec',
  });

  recording.stream().pipe(recognizeStream);

  return recording;
}

async function processQueue() {
  if (queue.length === 0) return;

  if (isProcessing){
    setTimeout(() => {
    processQueue(); // retry
  }, 50);
    return;
  }

  isProcessing = true;
  const speechSegment = queue.shift();

  // Type speech segment
  await ks.keyboard.printText(speechSegment, 20);

  isProcessing = false;
}

function addToQueue(speechSegment) {
  queue.push(speechSegment);
  processQueue();
}

module.exports = {
  startSpeechRecognition,
};