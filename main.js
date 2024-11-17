const { app, BrowserWindow, ipcMain, session, systemPreferences } = require('electron')
const path = require('path')

const { startSpeechRecognition } = require('./speechRecognition/googleUSM.js');

let win = null
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

// async function typeMessage (event, message) {
//   win.webContents.send('update-info-text', "Listening...")

//   // startSpeechRecognition('utterance');
// }

async function startListening (event, model, mode) {
  // win.webContents.send('update-info-text', "Listening...")

  console.log('startListening', model, mode)
  startSpeechRecognition(mode);
}

app.whenReady().then(() => {
  // ipcMain.on('type-message', typeMessage)
  ipcMain.on('start-listening', startListening)
  
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

