/// <reference types="vite/client" />

interface ImportMetaEnv {
  // All API keys are handled by Firebase Functions
  readonly VITE_FIREBASE_FUNCTION_URL?: string;
  // Add other frontend-specific environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
