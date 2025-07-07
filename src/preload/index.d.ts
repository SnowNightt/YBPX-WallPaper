export interface API {
  setWallPaper: (url: string, path: string) => void
  downLoadImage: (url: string) => void
  setImageSaveDirectory: () => Promise<string>
  existsPath: (path: string) => Promise<boolean>
  quit: () => void
  miniSize: () => void
  path: {
    join: (...args: string[]) => string
  }
}

export interface IpcRenderer {
  send: (channel: string, data?: unknown) => void
  on: (channel: string, func: (...args: unknown[]) => void) => void
  removeAllListeners: (channel: string) => void
}

export interface Electron {
  ipcRenderer: IpcRenderer
}

export interface Logout {
  ipcRenderer: {
    send: (channel: string, data: unknown) => void
    on: (channel: string, func: (...args: unknown[]) => void) => void
  }
}

declare global {
  interface Window {
    api: API
    logout: Logout
    electron: Electron
  }
}
