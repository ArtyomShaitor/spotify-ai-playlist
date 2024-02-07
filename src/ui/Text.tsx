import { ReactNode } from "react";

interface TextProps {
  children: ReactNode;
}

export const Text = ({ children }: TextProps) => {
  return <span className="text-slate-500">{children}</span>;
};

export const SmallText = ({ children }: TextProps) => {
  return <span className="text-slate-500 text-sm">{children}</span>;
};
