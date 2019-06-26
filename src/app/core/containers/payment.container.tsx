import * as React from "react";
import createContainer from "constate";
import { ConfigContext, ConsumerContext } from ".";

//  ==== STATUS ====>
export enum PaymentStatus {
  Eth = "eth",
  Wifi = "wifi",
  Mobile = "mobile"
}

/* ==== MAIN ==== */
/* ======================================== */

const PaymentContainer = createContainer(() => {

  const configConsumer = React.useContext(ConfigContext);
  const consumerConsumer = React.useContext(ConsumerContext);

  React.useEffect(() => {
    console.log("PaymentContainer => INIT");
    return () => {
      console.log("PaymentContainer => END");
    };
  }, []);


  return {

  };
});

export const PaymentProvider = PaymentContainer.Provider;
export const PaymentContext = PaymentContainer.Context;