import router from '@renderer/router'
import useConfigStore from '@renderer/store'
import { ElMessage } from 'element-plus'

export default () => {
  const useConfig = useConfigStore()
  // 在首页设置壁纸
  const setWallPaper = async () => {
    const state = await window.api.existsPath(useConfig.config.imageSaveDirectory)
    if (!state) {
      ElMessage.error('设置的保存路径无效')
      console.log(router)
      return router.push({ name: 'setting' })
    }
    window.api.setWallPaper(useConfig.config.url, useConfig.config.imageSaveDirectory)
  }
  // 下载壁纸
  const downLoadImage = () => {
    window.api.downLoadImage(useConfig.config.url)
  }
  // 设置壁纸保存路径
  const setImageSave = async () => {
    const path = await window.api.setImageSaveDirectory()
    useConfig.config.imageSaveDirectory = path
  }
  // 在全部页面设置壁纸
  const allPageSetWallPaper = async (url: string) => {
    const state = await window.api.existsPath(useConfig.config.imageSaveDirectory)
    if (!state) {
      ElMessage.error('设置的保存路径无效')
      console.log(router)
      return router.push({ name: 'setting' })
    }
    window.api.setWallPaper(url, useConfig.config.imageSaveDirectory)
  }
  return { setWallPaper, downLoadImage, setImageSave, allPageSetWallPaper }
}
