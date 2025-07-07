import { BrowserWindow, IpcMainEvent, Menu, app, ipcMain } from 'electron'
ipcMain.on('quit', (_event: IpcMainEvent) => {
  const template = [
    // {
    //   label: '最小化',
    //   click: () => {
    //     const mainWindow = BrowserWindow.getFocusedWindow()
    //     if (mainWindow) {
    //       mainWindow.minimize()
    //     }
    //   }
    // },
    {
      label: '退出',
      click: () => app.quit()
    },
    {
      label: '退出登录',
      click: () => {
        // 发送 IPC 消息给渲染进程
        const windows = BrowserWindow.getAllWindows()
        if (windows.length > 0) {
          windows[0].webContents.send('logout')
        }
      }
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup()
})
