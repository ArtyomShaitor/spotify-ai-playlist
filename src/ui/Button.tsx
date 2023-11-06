"use client";

import { HTMLAttributes, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: HTMLAttributes<HTMLElement>["className"];
  href?: string;
  isDisabled?: boolean;
}

export const Button = ({
  href,
  children,
  onClick,
  className = "",
  isDisabled = false,
}: ButtonProps) => {
  const Component = href ? "a" : "button";

  return (
    <Component
      className={`inline-block cursor-pointer rounded border border-black bg-black px-6 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-black focus:outline-none focus:ring active:text-black-500 ${className}`}
      onClick={() => onClick?.()}
      disabled={isDisabled}
      {...(href ? { href } : {})}
    >
      {children}
    </Component>
  );
};
