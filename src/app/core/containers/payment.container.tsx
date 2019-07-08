import * as React from "react";
import createContainer from "constate";
import { ConfigContext, ConsumerContext } from ".";
import { __ } from "@core/utils/lib/i18n";
import { SOCKET_PAYMENT, Pages } from "@core/utils/constants";
import { map, tap } from "rxjs/operators";
import { Subject, BehaviorSubject } from "rxjs";
import { IBeverage } from "@core/models";
import { withRouter } from "react-router-dom";

//  ==== STATUS ====>
export enum PaymentMode {
  Pay = "pay",
  Free = "free",
  Null = ""
}

export enum PaymentStatus {
  NotAuthorized = "NOT-AUTHORIZED",
  Swiped = "SWIPED",
  Authorized = "AUTHORIZED",
  Declined = "DECLINED",
  VendApprove = "VENDAPPROVE",
  VendComplete = "VENDCOMPLETE",
  EndSession = "ENDSESSION",
  Power = "POWER",
  Cancel = "CANCEL"
}

export enum PaymentStatusPour {
  "AUTHORIZED",
  "VENDAPPROVE"
}

/* ==== MAIN ==== */
/* ======================================== */

const PaymentContainer = createContainer((props: any) => {

  const statusPayment_ = React.useRef<PaymentStatus>(PaymentStatus.NotAuthorized);
  const socketPayment$ = React.useRef(new BehaviorSubject<PaymentStatus>(PaymentStatus.NotAuthorized));

  const dataPayment_ = React.useRef<any>(null);

  const configConsumer = React.useContext(ConfigContext);
  const consumerConsumer = React.useContext(ConsumerContext);

  const { vendorConfig } = configConsumer;
  const { currency } = vendorConfig;

  const [paymentModeEnabled, setPaymentModeEnabled] = React.useState<boolean>(null);

  React.useEffect(() => {
    if (vendorConfig && vendorConfig.pay_id) {
      setPaymentModeEnabled(vendorConfig.pay_id === PaymentMode.Pay);
    }
  }, [vendorConfig.pay_id]);

  React.useEffect(() => {

    /* ==== PAYMENT SOCKET ==== */
    /* ======================================== */
    const { ws } = configConsumer;
    const socketPayment_ = ws
    .multiplex(
      () => console.info(`Start => ${SOCKET_PAYMENT}`),
      () => console.info(`End => ${SOCKET_PAYMENT}`),
      (data) => data && data.message_type === SOCKET_PAYMENT
    )
    .pipe(
      map((data: any) => data.value)
    );

    socketPayment_
    .pipe(
      map(value => {
        if (value.message === PaymentStatus.EndSession) {
          value.message = PaymentStatus.NotAuthorized;
        }
        return value;
      }),
      tap(value => socketPayment$.current.next(value.message)),
      tap(value => {
        const { pathname } = props.location;
        if (value.message === PaymentStatus.Swiped && pathname === Pages.Attractor) {
          props.history.push(Pages.Home);
        }
      })
    )
    .subscribe(
      value => {
        statusPayment_.current = value.message;
        dataPayment_.current = value.message === PaymentStatus.Cancel ? value.data : null;
      }
    );

  }, []);

  function restartPayment() {
    socketPayment$.current.next(PaymentStatus.NotAuthorized);
    statusPayment_.current = PaymentStatus.NotAuthorized;
  }

  function getPriceBeverage(value: number) {
    if (value === 0) {
      return __("c_free");
    }
    if (value < 100 && currency === "USD") {
      return `${String(value / 100).replace(/^0\.+/, "")} ${__("c_cent")}`;
    }
    return `${value / 100} ${__(`c_${currency}`)}`;
  }

  function needToPay(beverage?: IBeverage) {
    if (beverage && beverage.$price === 0) {
      return false;
    }
    return paymentModeEnabled;
  }

  function canPour() { /* NOT GENERATE RENDERING */
    return statusPayment_.current in PaymentStatusPour;
  }

  return {
    socketPayment$,
    restartPayment,
    paymentModeEnabled,
    currency,
    getPriceBeverage,
    needToPay,
    canPour,
    statusPayment_,
    dataPayment_
  };
});

export const PaymentProvider = withRouter(PaymentContainer.Provider);
export const PaymentContext = PaymentContainer.Context;