import http from './axios'
import { ResDataType } from './type'
export const reqImageList = async (page: number): Promise<ResDataType> => {
  return await http.get(`image/imagelist?page=${page}`)
}
export const reqSearchImages = async (keyWords: string, page: number): Promise<ResDataType> => {
  return await http.post(`image/search`, { keyWords, page })
}
