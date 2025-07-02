import { IpcMainEvent, ipcMain } from 'electron'
import downLoad from '../utils/downLoad'
import wallpaper from 'wallpaper'
import path from 'node:path'
ipcMain.on('setWallPaper', async (_event: IpcMainEvent, url: string, localPath: string) => {
  const localDir = path.resolve(localPath, url.split('/').pop()!)
  console.log(localDir);
  
  await downLoad(url, localDir)
  wallpaper.set(localDir, { screen: 'all', scale: 'auto' })
})
