import * as React from "react";
import createUseContext from "constate";

export const DEFAULT_TIMEOUT_ALERT = 3000;

export enum AlertTypes {
  LoadingDataQr = "c_loading_data_qr",
  OutOfStock = "c_out_of_stock",
  ErogationLimit = "c_erogation_limit",
  OutOfOrder = "c_out_of_order",
  Promotion = "c_promotion",
  SignedOut = "c_signed_out",
  EndSession = "c_end_session",
  NeedPayment = "p_not-authorized",
  AuthorizingPayment = "p_swiped",
  EndSparkling = "c_end_sparkling",
  ErrorLoadingQr = "c_error_loading_qr",
  MachineDoesNotParticipate = "c_machine_does_not_participate",
  ErrorLoadingQrPayment = "c_error_loading_qr_payment",
  ErrorWebcam = "c_error_webcam",
  ErrorQrNotFound = "c_error_qr_not_found",
  ErrorQrNotValid = "c_error_qr_not_valid",
  ErrorUnassociatedBottle = "c_error_unassociated_bottle",
  ErrorADAPanelDown = "c_ada_panel_down",
  ErrorPaymentDown = "p_payment_down",
  DailyLimitReached = "c_daily_limit_reached",
  SubscriptionExpired = "c_subscription_expired",
  PaymentDeclined = "p_declined",
  CardNotRead = "p_card_not_read"
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
  data?: any;
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
//test 1 from gitHub
export const withAlert = Comp => props => {
  const alert = React.useContext(AlertContext);
  return (
    <Comp {...props} alertConsumer={alert}></Comp>
  );
};

export const AlertContext = AlertContainer.Context;






  // React.useEffect(() => { // PAYMENT DOWN ALERT
  //   alertConsumer.show({
  //     type: AlertTypes.ErrorPaymentDown,
  //     img: "img/alerts/payment-system-down.svg",
  //     subTitle: true,
  //     onDismiss: () => {}
  //   });
  // }, []);

  // React.useEffect(() => { // CARD PROCESSING ISSUE ALERT
  //   alertConsumer.show({
  //     type: AlertTypes.PaymentDeclined,
  //     img: "img/alerts/payment-alert.svg",
  //     subTitle: true,
  //     onDismiss: () => {}
  //   });
  // }, []);

  // React.useEffect(() => { // CARD NOT READ ALERT
  //   alertConsumer.show({
  //     type: AlertTypes.CardNotRead,
  //     img: "img/alerts/payment-alert.svg",
  //     subTitle: true,
  //     onDismiss: () => {}
  //   });
  // }, []);

  // React.useEffect(() => { // AUTHORIZING PAYMENT ALERT
  //   alertConsumer.show({
  //     type: AlertTypes.AuthorizingPayment,
  //     img: "img/alerts/authorizing-payment.svg",
  //     subTitle: true,
  //     onDismiss: () => {}
  //   });
  // }, []);
