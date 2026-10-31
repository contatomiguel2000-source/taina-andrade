type P = { className?: string };

export const IconPhone = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

export const IconWhatsapp = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 2.5 1 3 .8 3.6.7.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 21.5c-1.7 0-3.3-.4-4.7-1.3l-.3-.2-3.5.9.9-3.4-.2-.4A9.5 9.5 0 1 1 12 21.5zm0-21A11.5 11.5 0 0 0 2.1 17.7L.5 23.5l6-1.6A11.5 11.5 0 1 0 12 .5z" />
  </svg>
);

export const IconInstagram = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);

export const IconArrow = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const IconStar = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
  </svg>
);

export const IconCheck = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className} aria-hidden>
    <path d="m5 12 5 5L20 7" />
  </svg>
);

export const IconPin = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const IconClock = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const IconFacebook = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21z" />
  </svg>
);

export const IconTiktok = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M16.6 2h-3.3v13.2a2.9 2.9 0 1 1-2.1-2.8V9a6.3 6.3 0 1 0 5.4 6.2V8.6a7.9 7.9 0 0 0 4.4 1.4V6.6a4.5 4.5 0 0 1-4.4-4.6z" />
  </svg>
);

export const IconLinkedin = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z" />
  </svg>
);

export const IconPlus = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconRight = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconYoutube = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.75 15.02V8.98L15.5 12z" />
  </svg>
);
