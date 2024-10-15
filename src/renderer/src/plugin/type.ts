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
