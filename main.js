const { app, BrowserWindow, ipcMain, session, systemPreferences } = require('electron')
const path = require('path')
const recorder = require('node-record-lpcm16');
const speech = require('@google-cloud/speech');
const { Hardware } = require('keysender');

const { startSpeechRecognition } = require('./speechRecognition/googleUSM.js');

let win = null
const ks = new Hardware();

const speechClient = new speech.SpeechClient();

const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  singleUtterance: true, // If you want to end the speech recognition after the first spoken sentence, set this to true
  interimResults: false, // If you want interim results, set this to true
};

// Create a recognize stream
const recognizeStream = speechClient
  .streamingRecognize(request)
  .on('error', console.error)
  .on('data', data => {
    process.stdout.write(
      data.results[0] && data.results[0].alternatives[0]
        ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
        : '\n\nReached transcription time limit, press Ctrl+C\n'
    )
    if(data.results[0] && data.results[0].alternatives[0])
      ks.keyboard.printText(data.results[0].alternatives[0].transcript, 50);


  }
    

  );

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
     preload: path.join(__dirname, 'preload.js'),
   }
  })

  // Allow microphone access for speech recognition
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') {
      callback(true);
    }
  });

  win.loadFile('index.html')
}

async function typeMessage (event, message) {
  // Start recording and send the microphone input to the Speech API.
  // Ensure SoX is installed, see https://www.npmjs.com/package/node-record-lpcm16#dependencies
  // recorder
  // .record({
  //   sampleRateHertz: sampleRateHertz,
  //   threshold: 0,
  //   // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
  //   verbose: false,
  //   recordProgram: 'rec', // Try also "arecord" or "sox"
  //   silence: '10.0',
  // })
  // .stream()
  // .on('error', console.error)
  // .pipe(recognizeStream);

  win.webContents.send('update-info-text', "Listening...")

  startSpeechRecognition('utterance');

  // wait three seconds before typing message
  // await new Promise(resolve => setTimeout(resolve, 3000))
  // await ks.keyboard.printText("hello world", 50);
  // await ks.keyboard.sendKey(["ctrl", "a"], [25, 50]);
}

app.whenReady().then(() => {
  ipcMain.on('type-message', typeMessage)
  
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

