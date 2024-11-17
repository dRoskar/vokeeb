const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('vokeebAPI', {
  // updateInfoText: (callback) => ipcRenderer.on('update-info-text', (_event, value) => callback(value)),
  // typeMessage: (message) => ipcRenderer.send('type-message', message)

  startListening: (model, mode) => ipcRenderer.send('start-listening', model, mode)
})