export interface Data {
  id: number
  fileName: string
  created_at: any
  updatedAt: any
  description: string
}
interface Meta {
  current_page: number
  total: number
  total_page: number
}
interface dataType {
  data: Data[]
  meta: Meta
}
export interface ResDataType {
  data: dataType
  config: any
  headers: any
  request: any
  status: number
  statusText: string
}
export interface ILoginMessage {
  username: string
  password: string
}
export interface ICollectImage {
  wallpaperName: string
  userId: number
}
export interface IUserId {
  userId: number
}
export interface IUserInfo {
  username: string
  qqAccount?: string
  wechat?: string
  email?: string
  nickname?: string
}
