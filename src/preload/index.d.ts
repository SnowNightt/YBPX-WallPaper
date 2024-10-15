import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface apiOpt {
    setWallPaper: (url: string, path: string) => void
    downLoadImage: (url: string) => void
    setImageSaveDirectory: () => Promise<string>
    existsPath: (path: string) => Promise<boolean>
    quit: () => void
  }
  interface Window {
    electron: ElectronAPI
    api: apiOpt
  }
}
