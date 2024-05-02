import { IpcMainInvokeEvent, ipcMain } from 'electron'
import fs from 'fs'
ipcMain.handle('existsPath', (_event: IpcMainInvokeEvent, path: string) => {
  return fs.existsSync(path)
})
