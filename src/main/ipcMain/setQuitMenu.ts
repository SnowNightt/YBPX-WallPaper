import { BrowserWindow, IpcMainEvent, Menu, app, ipcMain } from 'electron'
ipcMain.on('quit', (_event: IpcMainEvent) => {
  const template = [
    {
      label: '最小化',
      click: () => {
        const mainWindow = BrowserWindow.getFocusedWindow()
        if (mainWindow) {
          mainWindow.minimize()
        }
      }
    },
    {
      label: '退出',
      click: () => app.quit()
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup()
})
