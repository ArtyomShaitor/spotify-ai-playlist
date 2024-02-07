"use client";

import { HTMLAttributes, ReactNode } from "react";
import { createUIComponent } from "./utils";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: HTMLAttributes<HTMLElement>["className"];
  href?: string;
  isDisabled?: boolean;
}

export const Button = createUIComponent<ButtonProps>(
  ({ href, children, onClick, className = "", isDisabled = false }) => {
    const Component = href ? "a" : "button";

    return (
      <Component
        className={`inline-block cursor-pointer rounded-lg border border-primary bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring active:bg-gray-950 ${className}`}
        onClick={() => onClick?.()}
        disabled={isDisabled}
        {...(href ? { href } : {})}
      >
        {children}
      </Component>
    );
  },
);

export const PrimaryButton = createUIComponent<ButtonProps>(
  ({ href, children, onClick, className = "", isDisabled = false }) => {
    const Component = href ? "a" : "button";

    return (
      <Component
        className={`inline-block cursor-pointer border border-primary text-sm font-medium text-white focus:outline-none focus:ring active:bg-gray-950 w-fit px-6 py-2.5 bg-green-500 rounded-full hover:bg-green-600 hover:text-white`}
        onClick={() => onClick?.()}
        disabled={isDisabled}
        {...(href ? { href } : {})}
      >
        {children}
      </Component>
    );
  },
);
