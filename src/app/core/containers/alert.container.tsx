import * as React from "react";
import createContainer from "constate";
import { Alert } from "@modules/consumer/components/common/Alert"; // => TO IMPORVE

export const DEFAULT_TIMEOUT_ALERT = 1500;

export enum AlertTypes {
  Success = "success",
  Error = "error",
  OutOfStock = "Out Of Stock",
  TimedOut = "Timed Out",
  EndBeverage = "Thank You!"
}

export interface AlertOptions {
  type?: AlertTypes;
  timeout?: boolean | number;
  onDismiss?: () => void;

  title?: string;
  content?: any;
  onConfirm?: () => void;
}

interface AlertState {
  show: boolean;
  options?: AlertOptions;
}

const AlertContainer = createContainer(() => {

  const [state, setState] = React.useState<AlertState>({
    show: false,
    options: {}
  });

  const show = (options?: AlertOptions) => {
    setState({
      show: true,
      options: options
    });
  };

  const hide = () => {
    setState({
      show: false,
      options: {}
    });
  };

  return { state, show, hide };
});

interface AlertProviderProps {
  children?: any;
  alertComponent: any;
}

export const AlertProvider = (props: AlertProviderProps) => {
  const { children, alertComponent } = props;
  return(
  <AlertContainer.Provider>
    {children}
    {alertComponent}
  </AlertContainer.Provider>
  );
};

export const withAlert = Comp => props => {
  const alert = React.useContext(AlertContext);
  return (
    <Comp {...props} alertConsumer={alert}></Comp>
  );
};

export const AlertContext = AlertContainer.Context;