export interface ActionWithPayload<T> {
  type: string
  payload: T
}

export interface ActionWithoutPayload {
  type: string
}
