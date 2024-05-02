import { dialog, ipcMain } from 'electron'
import downLoad from '../utils/downLoad'

ipcMain.on('downLoadImage', async (_event, url: string) => {
  const fileName = url.split('/').pop()
  const res = await dialog.showSaveDialog({
    title: '下载图片',
    message: 'wallpaper下载图片',
    defaultPath: fileName
  })
  console.log(res);
  
  if (res.canceled == false && res.filePath) downLoad(url, res.filePath)
})
