import { IpcMainInvokeEvent, dialog, ipcMain } from 'electron'

ipcMain.handle('setImageSaveDirectory', async (_event: IpcMainInvokeEvent) => {
  const res = await dialog.showOpenDialog({
    title: '请选择路径',
    properties: ['openDirectory', 'createDirectory']
  })
  if (res.canceled == false && res.filePaths.length) return res.filePaths[0]
  else return ''
})
