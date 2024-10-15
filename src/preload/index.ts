import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

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
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
