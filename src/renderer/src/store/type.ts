export interface dataType {
  id?: number
  fileName?: string
  created_at?: any
  updatedAt?: any
  description?: string
  wallpaper?:string
}
export interface configType {
  url: string
  imageSaveDirectory: string
  likeList: dataType[]
  homeImageUrl: string
  searchImages: dataType[]
  key: string
  currentPage: number
  total: number,
  email?:string,
  theme?:string
}
export interface IUserInfo {
  username: string
  id: string
}
