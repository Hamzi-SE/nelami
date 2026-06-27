/// <reference types="vite/client" />

declare module '*.css' {
  const content: string
  export default content
}

interface ImportMetaEnv {
  readonly REACT_APP_API_URL: string
  readonly REACT_APP_SOCKET_URL: string
  readonly REACT_APP_MAILCHIMP_U: string
  readonly REACT_APP_MAILCHIMP_ID: string
  readonly REACT_APP_STRIPE_PK: string
  readonly REACT_APP_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
