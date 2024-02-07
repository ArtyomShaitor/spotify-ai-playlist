import { FC } from "react";
import { Color } from "@/theme/colors";

interface NewProps {
  colorScheme?: Color;
}

export const createUIComponent = <Props = {},>(
  Component: FC<Props & NewProps>,
) => {
  const WrappedComponent: FC<Props & NewProps> = (props: Props & NewProps) => {
    return <Component {...props} />;
  };

  return WrappedComponent;
};
