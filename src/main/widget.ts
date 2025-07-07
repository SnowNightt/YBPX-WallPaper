import { BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

let widgetWindow: BrowserWindow | null = null

interface DragListener {
  mousemove?: (event: Electron.IpcMainEvent, data: { screenX: number; screenY: number }) => void
  mouseup?: (event: Electron.IpcMainEvent) => void
  dragstart?: (event: Electron.IpcMainEvent) => void
}

const dragListeners: DragListener = {}

// 创建桌面挂件窗口
export function createWidgetWindow(): void {
  // 如果窗口已存在，直接显示
  if (widgetWindow) {
    widgetWindow.show()
    return
  }

  // 获取主显示器
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize
  const scaleFactor = primaryDisplay.scaleFactor

  console.log('Creating widget window...')

  // 计算窗口位置，确保在屏幕内
  const windowWidth = 300
  const windowHeight = 400
  const x = Math.max(0, Math.floor((width - windowWidth) / scaleFactor))
  const y = Math.max(0, Math.floor((height - windowHeight) / scaleFactor))

  widgetWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x,
    y,
    frame: false,
    transparent: true,
    hasShadow: true, // 启用阴影以提高可见性
    focusable: false, // 允许窗口获得焦点
    alwaysOnTop: false,
    skipTaskbar: true,
    resizable: false,
    show: true, // 立即显示窗口
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // 加载挂件页面
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    const widgetUrl = new URL('/widget.html', process.env['ELECTRON_RENDERER_URL']).toString()
    console.log('Loading widget URL:', widgetUrl)
    widgetWindow.loadURL(widgetUrl)
    widgetWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    const widgetPath = join(__dirname, '../renderer/widget.html')
    console.log('Loading widget file:', widgetPath)
    widgetWindow.loadFile(widgetPath)
  }

  // 监听加载错误
  widgetWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Widget window failed to load:', errorCode, errorDescription)
  })

  // 确保窗口创建后显示
  widgetWindow.once('ready-to-show', () => {
    console.log('Widget window is ready to show')
    if (widgetWindow) {
      widgetWindow.show()
      widgetWindow.focus() // 确保窗口获得焦点
    }
  })

  // 清理旧的事件监听器
  cleanupDragListeners()

  // 窗口拖动事件处理
  ipcMain.on('widget-drag-start', (_event, { mouseX, mouseY }) => {
    if (!widgetWindow) return

    const handleMouseMove = (e: Electron.IpcMainEvent, data: { screenX: number; screenY: number }) => {
      if (!widgetWindow) return
      const scaleFactor = screen.getPrimaryDisplay().scaleFactor
      const newX = Math.floor((data.screenX - mouseX) / scaleFactor)
      const newY = Math.floor((data.screenY - mouseY) / scaleFactor)
      
      // 确保窗口不会移出屏幕
      const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize
      const finalX = Math.max(0, Math.min(newX, screenWidth - windowWidth))
      const finalY = Math.max(0, Math.min(newY, screenHeight - windowHeight))
      
      widgetWindow.setPosition(finalX, finalY)
    }

    const handleMouseUp = () => {
      if (!widgetWindow) return
      cleanupDragListeners()
    }

    // 保存监听器引用以便清理
    dragListeners.mousemove = handleMouseMove
    dragListeners.mouseup = handleMouseUp

    ipcMain.on('widget-mouse-move', handleMouseMove)
    ipcMain.on('widget-mouse-up', handleMouseUp)
  })

  // 窗口显示/隐藏控制
  ipcMain.on('toggle-widget', (_event, show: boolean) => {
    if (!widgetWindow) return
    if (show) {
      widgetWindow.show()
      widgetWindow.focus()
    } else {
      widgetWindow.hide()
    }
  })

  // 监听窗口关闭事件
  widgetWindow.on('closed', () => {
    cleanupDragListeners()
    widgetWindow = null
  })
}

// 清理拖动相关的事件监听器
function cleanupDragListeners(): void {
  if (dragListeners.mousemove) {
    ipcMain.removeListener('widget-mouse-move', dragListeners.mousemove)
    delete dragListeners.mousemove
  }
  if (dragListeners.mouseup) {
    ipcMain.removeListener('widget-mouse-up', dragListeners.mouseup)
    delete dragListeners.mouseup
  }
  if (dragListeners.dragstart) {
    ipcMain.removeListener('widget-drag-start', dragListeners.dragstart)
    delete dragListeners.dragstart
  }
}

// 获取挂件窗口实例
export function getWidgetWindow(): BrowserWindow | null {
  return widgetWindow
} 