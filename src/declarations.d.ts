// src/declarations.d.ts

// Declare global variables provided by the Canvas environment
declare const __app_id: string | undefined;
declare const __firebase_config: string | undefined;
declare const __initial_auth_token: string | undefined;

// Extend the Window interface to include crypto for randomUUID fallback
interface Window {
    crypto: Crypto;
}

interface Crypto {
    randomUUID: () => string;
}