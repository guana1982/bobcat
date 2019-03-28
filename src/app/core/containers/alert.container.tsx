import * as React from "react";
import createContainer from "constate";
import { ConfigContext } from "./config.container";
import { Alert } from "@core/components/global/Alert";

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

export const AlertProvider = (props) => {
  const { children } = props;
  return(
  <AlertContainer.Provider>
    {children}
    <Alert />
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