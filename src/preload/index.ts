import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { join } from 'path'

// Custom APIs for renderer
const api = {
  setWallPaper: (url: string, path: string) => {
    ipcRenderer.send('setWallPaper', url, path)
  },
  downLoadImage: (url: string) => {
    ipcRenderer.send('downLoadImage', url)
  },
  setImageSaveDirectory: () => {
    return ipcRenderer.invoke('setImageSaveDirectory')
  },
  existsPath: (path: string) => {
    return ipcRenderer.invoke('existsPath', path)
  },
  quit: () => {
    ipcRenderer.send('quit')
  },
  miniSize: () => {
    ipcRenderer.send('minimize-window')
  },
  path: {
    join: (...args: string[]) => join(...args)
  }
}
const logout = {
  ipcRenderer: {
    send: (channel: string, data: unknown) => ipcRenderer.send(channel, data),
    on: (channel: string, func: (...args: unknown[]) => void) => 
      ipcRenderer.on(channel, (_event, ...args) => func(...args))
  }
}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('logout', logout)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
