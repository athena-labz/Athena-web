import React from "react";

type LoadingIconProps = {
  className?: string;
};

export const LoadingIcon = ({ className }: LoadingIconProps) => {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20a8 8 0 01-8-8H0c0 4.418 3.582 8 8 8v-4zm2-17.938A7.962 7.962 0 0112 4v4c3.042 0 5.824-1.135 7.938-3l-2.647-3zM12 4a7.963 7.963 0 01-7.938 7H4c0-3.042 1.135-5.824 3-7.938L12 4zm5.291 6H12V4h4v6z"
      />
    </svg>
  );
};
