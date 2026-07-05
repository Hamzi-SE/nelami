const BASE_URL = process.env.REACT_APP_API_URL

const customFetch = (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_URL}${endpoint}`

  const fetchOptions: RequestInit = {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  }

  return fetch(url, fetchOptions)
}

export default customFetch
