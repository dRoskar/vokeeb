const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  updateInfoText: (callback) => ipcRenderer.on('update-info-text', (_event, value) => callback(value)),
  typeMessage: (message) => ipcRenderer.send('type-message', message)
})