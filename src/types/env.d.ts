interface ImportMetaEnv {
  /** Form backend URL that accepts a JSON POST (e.g. Formspree, Web3Forms, your own API). See .env.example */
  readonly VITE_CONTACT_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
