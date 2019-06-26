import * as React from "react";
import createContainer from "constate";
import { Alert } from "@modules/consumer/components/common/Alert"; // => TO IMPORVE

export const DEFAULT_TIMEOUT_ALERT = 2000;

export enum AlertTypes {
  LoadingDataQr = "c_loading_data_qr",
  Error = "c_error",
  OutOfStock = "c_out_of_stock",
  EndBeverage = "c_end_session",
  EndSparkling = "c_end_sparkling",
  ErrorWebcam = "c_error_webcam",
  ErrorQrNotFound = "c_error_qr_not_found",
  ErrorUnassociatedBottle = "c_error_unassociated_bottle",
  ErrorADAPanelDown = "c_ada_panel_down"
}

export interface AlertOptions {
  type?: AlertTypes;
  timeout?: boolean | number;
  lock?: boolean;
  transparent?: boolean;
  onDismiss?: () => void;

  title?: string;
  subTitle?: boolean;
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