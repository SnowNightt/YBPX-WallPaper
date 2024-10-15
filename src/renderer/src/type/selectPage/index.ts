export interface dataType {
  id: number
  fileName: string
  created_at: any
  updatedAt: any
  isLike?: boolean
  description?: string
}

export interface configType {
  currentPage: number
  pageSize: number
  total: number
  isSmall: boolean
  isDisabel: boolean
  isBackground: boolean
}
