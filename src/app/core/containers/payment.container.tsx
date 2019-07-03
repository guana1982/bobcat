import * as React from "react";
import createContainer from "constate";
import { ConfigContext, ConsumerContext } from ".";
import { __ } from "@core/utils/lib/i18n";

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
  const { currency } = vendorConfig;

  const [paymentEnabled, setPaymentEnabled] = React.useState<boolean>(null);

  React.useEffect(() => {
    if (vendorConfig && vendorConfig.pay_id) {
      setPaymentEnabled(vendorConfig.pay_id === PaymentMode.Pay);
    }
  }, [vendorConfig.pay_id]);

  function getPriceBeverage(value: number) {
    if (value === 0) {
      return __("c_free");
    }
    if (value < 100 && currency === "USD") {
      return `${String(value / 100).replace(/^0+/, "")} ${__("c_cent")}`;
    }
    return `${value / 100} ${__(`c_${currency}`)}`;
  }

  return {
    paymentEnabled,
    currency,
    getPriceBeverage
  };
});

export const PaymentProvider = PaymentContainer.Provider;
export const PaymentContext = PaymentContainer.Context;