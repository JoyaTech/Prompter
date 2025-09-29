import React from 'react';

// FIX: Added icon components to resolve module not found errors.
export const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 3a9 9 0 019 9h-2a7 7 0 00-7-7V3z" fill="url(#grad1)" />
    <path d="M21 12a9 9 0 01-9 9v-2a7 7 0 007-7h2z" fill="url(#grad2)" />
    <path d="M12 21a9 9 0 01-9-9h2a7 7 0 007 7v2z" fill="url(#grad3)" />
    <path d="M3 12a9 9 0 019-9v2a7 7 0 00-7 7H3z" fill="url(#grad4)" />
    <defs>
      <linearGradient id="grad1" x1="12" y1="3" x2="21" y2="12">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
      <linearGradient id="grad2" x1="21" y1="12" x2="12" y2="21">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#A78BFA" />
      </linearGradient>
      <linearGradient id="grad3" x1="12" y1="21" x2="3" y2="12">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
      <linearGradient id="grad4" x1="3" y1="12" x2="12" y2="3">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#60A5FA" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="2" fill="white" />
  </svg>
);

export const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

export const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const WandIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.71 0L11.5 9.51" />
    <path d="m16.5 12.5 4.86-4.86a1.21 1.21 0 0 0 0-1.71l-1.28-1.28a1.21 1.21 0 0 0-1.71 0L13.5 9.5" />
    <path d="M5 21v-3.5l7-7" />
    <path d="M5 12.5 2.24 9.74a1.21 1.21 0 0 0 0-1.71L3.5 6.75a1.21 1.21 0 0 0 1.71 0L7.5 9.5" />
    <path d="m14.5 16.5 4.86-4.86a1.21 1.21 0 0 0 0-1.71l-1.28-1.28a1.21 1.21 0 0 0-1.71 0L11.5 13.5" />
    <path d="M9.5 7.5 12 5" />
    <path d="m3.5 15.5 4 4" />
    <path d="m12.5 5.5 4-4" />
  </svg>
);

export const SaveIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
);
