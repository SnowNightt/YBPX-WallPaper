import http from './axios'
import { ResDataType, ILoginMessage, ICollectImage, IUserId } from './type'
export const reqImageList = async (page: number): Promise<ResDataType> => {
  return await http.get(`image/imagelist?page=${page}`)
}
// 搜索图片
export const reqSearchImages = async (keyWords: string, page: number): Promise<ResDataType> => {
  return await http.post(`image/search`, { keyWords, page })
}
export const authLogin = async (param: ILoginMessage) => {
  return await http.post('/auth/login', param)
}
export const authRegister = async (param: ILoginMessage) => {
  return await http.post('/auth/register', param)
}
// 收藏
export const collectImage = async (param: ICollectImage) => {
  return await http.post('/image/collect', param)
}
// 取消收藏
export const uncollectImage = async (param: ICollectImage) => {
  return await http.post('/image/uncollect', param)
}
// 获取收藏的壁纸
export const getCollectImage = async (param: IUserId) => {
  return await http.get('/image/favorites', { params: param })
}