"use client";

import { HTMLAttributes } from "react";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: HTMLAttributes<HTMLElement>["className"];
  isDisabled?: boolean;
}

export const Input = ({
  value,
  onChange,
  placeholder = "",
  className = "",
  isDisabled = false,
}: InputProps) => {
  return (
    <input
      className={`block shadow-sm rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${className}`}
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      disabled={isDisabled}
    />
  );
};
