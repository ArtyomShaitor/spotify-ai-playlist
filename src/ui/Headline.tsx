import { HTMLAttributes, ReactElement, ReactNode } from "react";

interface HeadlineProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: HTMLAttributes<HTMLHeadingElement>["className"];
}

const FONT_SIZES: Record<Required<HeadlineProps>["as"], string> = {
  h1: "text-4xl",
  h2: "text-3xl",
  h3: "text-2xl",
  h4: "text-xl",
  h5: "text-lg",
  h6: "text-base",
};

export const Headline = ({
  as: As = "h1",
  children,
  className = "",
}: HeadlineProps) => {
  const fontSize = FONT_SIZES[As];
  return <As className={`${fontSize} font-bold ${className}`}>{children}</As>;
};
