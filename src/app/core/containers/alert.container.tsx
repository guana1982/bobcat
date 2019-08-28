import * as React from "react";
import createUseContext from "constate";

export const DEFAULT_TIMEOUT_ALERT = 2000;

export enum AlertTypes {
  LoadingDataQr = "c_loading_data_qr",
  LoadingQr = "c_loading_qr",

  OutOfStock = "c_out_of_stock",
  OutOfSoda = "c_out_of_soda",
  ErogationLimit = "c_erogation_limit",
  OutOfOrder = "c_out_of_order",

  SignedOut = "c_signed_out",
  EndSession = "c_end_session",
  LoadingPreferences = "c_loading_preferences",

  NeedPayment = "c_tap_swipe_pour",
  EndSparkling = "c_end_sparkling",

  ErrorLoadingQr = "c_error_loading_qr",
  ErrorLoadingQrPayment = "c_error_loading_qr_payment",
  ErrorWebcam = "c_error_webcam",
  ErrorQrNotFound = "c_error_qr_not_found",
  ErrorQrNotValid = "c_error_qr_not_valid",
  ErrorUnassociatedBottle = "c_error_unassociated_bottle",
  ErrorADAPanelDown = "c_ada_panel_down",
  ErrorPaymentDown = "p_payment_down",
  ErrorNoConnectivity = "c_no_connectivity",

  DailyLimitReached = "p_daily_limit_reached",
}

export interface AlertOptions {
  type?: AlertTypes | string;
  timeout?: boolean | number;
  lock?: boolean;
  transparent?: boolean;
  onDismiss?: () => void;
  title?: string;
  subTitle?: boolean;
  img?: string;
  content?: any;
  onConfirm?: () => void;
  backgroung?: string;
}

interface AlertState {
  show: boolean;
  options?: AlertOptions;
}

const AlertContainer = createUseContext(() => {

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