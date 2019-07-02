import * as React from "react";
import createContainer from "constate";
import { ConfigContext, ConsumerContext } from ".";

//  ==== STATUS ====>
export enum PaymentMode {
  Pay = "pay",
  Free = "free",
  Null = ""
}

export enum PaymentStatus {
  Swiped = "SWIPED",
  Authorized = "AUTHORIZED",
  Declined = "DECLINED",
  VendApprove = "VENDAPPROVE",
  EndSession = "ENDSESSION",
  Power = "POWER"
}

/* ==== MAIN ==== */
/* ======================================== */

const PaymentContainer = createContainer(() => {

  const configConsumer = React.useContext(ConfigContext);
  const consumerConsumer = React.useContext(ConsumerContext);

  const { vendorConfig } = configConsumer;
  const [paymentEnabled, setPaymentEnabled] = React.useState<boolean>(null);

  React.useEffect(() => {
    if (vendorConfig && vendorConfig.pay_id) {
      setPaymentEnabled(vendorConfig.pay_id === PaymentMode.Pay);
    }
  }, [vendorConfig.pay_id]);


  React.useEffect(() => {
    console.log({ paymentEnabled });
  }, [paymentEnabled]);

  return {

  };
});

export const PaymentProvider = PaymentContainer.Provider;
export const PaymentContext = PaymentContainer.Context;