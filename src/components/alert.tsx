import React from "react";
import {
  Alert as ShadAlert,
  AlertTitle,
  AlertDescription,
  type AlertProps as ShadAlertProps,
} from "./ui/alert";

export type AlertProps = ShadAlertProps & {
  icon?: React.ReactNode;
  title: string;
  description?: string;
};

const Alert = ({ icon, title, description, ...rest }: AlertProps) => {
  return (
    <ShadAlert {...rest}>
      {icon}
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </ShadAlert>
  );
};

export default Alert;
