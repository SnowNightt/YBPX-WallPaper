import { IpcMainEvent, Menu, app, ipcMain } from 'electron'
ipcMain.on('quit', (_event: IpcMainEvent) => {
  console.log(1)

  const template = [
    {
      label: '退出',
      click: () => app.quit()
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup()
})
