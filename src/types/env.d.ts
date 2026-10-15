interface ImportMetaEnv {
  /** Form backend URL that accepts a JSON POST (e.g. Formspree, Web3Forms, your own API). See .env.example */
  readonly VITE_CONTACT_ENDPOINT?: string
  /** Optional chat backend for the assistant: POST { messages } → { reply }. Without it the assistant answers from the site's FAQs. */
  readonly VITE_ASSISTANT_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
