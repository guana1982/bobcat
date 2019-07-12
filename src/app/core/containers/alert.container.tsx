import * as React from "react";
import createContainer from "constate";
import { Alert } from "@modules/consumer/components/common/Alert"; // => TO IMPORVE

export const DEFAULT_TIMEOUT_ALERT = 2000;

export enum AlertTypes {
  LoadingDataQr = "c_loading_data_qr",
  LoadingQr = "c_loading_qr",

  OutOfStock = "c_out_of_stock",
  OutOfSoda = "c_out_of_soda",
  ErogationLimit = "c_erogation_limit",
  OutOfOrder = "c_out_of_order",
  EndBeverage = "c_end_session",

  NeedPayment = "c_tap_swipe_pour",
  EndSparkling = "c_end_sparkling",

  ErrorLoadingQr = "c_error_loading_qr",
  ErrorWebcam = "c_error_webcam",
  ErrorQrNotFound = "c_error_qr_not_found",
  ErrorUnassociatedBottle = "c_error_unassociated_bottle",
  ErrorADAPanelDown = "c_ada_panel_down",
  ErrorPaymentDown = "c_payment_down"
}

export interface AlertOptions {
  type?: AlertTypes;
  timeout?: boolean | number;
  lock?: boolean;
  transparent?: boolean;
  onDismiss?: () => void;
  title?: string;
  subTitle?: boolean;
  img?: string;
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