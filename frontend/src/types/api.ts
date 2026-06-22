export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  products?: T[]
  users?: T[]
  total?: number
  page?: number
  pages?: number
}
