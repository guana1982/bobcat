import * as React from "react";
import createUseContext from "constate";
import { ConfigContext, ConsumerContext, AlertContext, AlertTypes } from ".";
import { __ } from "@core/utils/lib/i18n";
import { SOCKET_PAYMENT, Pages, parsePriceBeverage } from "@core/utils/constants";
import { map, tap } from "rxjs/operators";
import { Subject, BehaviorSubject } from "rxjs";
import { IBeverage } from "@core/models";
import { withRouter } from "react-router-dom";
import { IPourCondition, IPromotionTypes, ISubscriptionTypes } from "@core/utils/APIModel";
import mediumLevel from "@core/utils/lib/mediumLevel";

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

export enum PaymentStatusCancel {
  "SWIPED",
  "AUTHORIZED"
}

/* ==== MAIN ==== */
/* ======================================== */

const PaymentContainer = createUseContext((props: any) => {

  const statusPayment_ = React.useRef<PaymentStatus>(PaymentStatus.NotAuthorized);
  const socketPayment$ = React.useRef(new BehaviorSubject<PaymentStatus>(PaymentStatus.NotAuthorized));

  const dataPayment_ = React.useRef<any>(null);

  const configConsumer = React.useContext(ConfigContext);
  const consumerConsumer = React.useContext(ConsumerContext);

  const { vendorConfig } = configConsumer;
  const { currency } = vendorConfig;

  const [paymentModeEnabled, setPaymentModeEnabled] = React.useState<boolean>(null);
  const [promotionEnabled, setPromotionEnabled] = React.useState<IPromotionTypes>(null);

  React.useEffect(() => {
    if (vendorConfig && vendorConfig.pay_id) {
      setPaymentModeEnabled(vendorConfig.pay_id === PaymentMode.Pay);
    }
  }, [vendorConfig.pay_id]);

  const { dataConsumer } = consumerConsumer;
  React.useEffect(() => {
    if (dataConsumer && dataConsumer.consumer_id) {

      // == MOCK =>
      // SubscriptionDailyAmount
      // PromotionFreePours
      // dataConsumer.events.push({"redeemThreshold":5,"promotionType": "SubscriptionDailyAmount","redeemAmount":4,"pour":"KO","name":"Promotion 12345","promotionAmountUnit":"Each","priority":0,"redeemStartDate":"2019-07-10","redeemEndDate":"2019-07-10","prmtnEvtId":"12345"});
      // <= MOCK ==

      if (dataConsumer.events.length === 0)
        return;

      const promotionsData = dataConsumer.events.sort((a, b) => (a.priority - b.priority));
      const promotionPourData = promotionsData.filter(event => event.pour === IPourCondition.Pour)[0];

      if (promotionPourData) {
        const { promotionType } = promotionPourData;
        if (promotionType === IPromotionTypes.PromotionFreePours) {
          const { redeemThreshold, redeemAmount } = promotionPourData;
          const remainderAmount = redeemThreshold - redeemAmount;
          alert(remainderAmount);
        }
        if (promotionType) {
          setPromotionEnabled(promotionType);
        }
      } else {
        const promotionNoPourData = promotionsData.filter(event => event.pour === IPourCondition.NoPour)[0];
        if (promotionNoPourData) {
          const { promotionType, redeemEndDate, redeemThreshold, redeemAmount } = promotionNoPourData
          if (promotionType === IPromotionTypes.SubscriptionDailyAmount) {
            const validEndDate: boolean = new Date(redeemEndDate) > new Date();
            if (!validEndDate) {
              alert("NO VALID END DATE");
              return;
            }
            const remainderAmount = redeemThreshold - redeemAmount;
            if (remainderAmount === 0) {
              alert("LIMIT EROGATION");
              return;
            }
          }
        }
      }

    } else {
      setPromotionEnabled(null);
    }
  }, [dataConsumer]);

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

  function cancelPayment() {
    mediumLevel.payment.vendCancel().subscribe();
  }

  function restartPayment() {
    socketPayment$.current.next(PaymentStatus.NotAuthorized);
    statusPayment_.current = PaymentStatus.NotAuthorized;
  }

  function displayPriceBeverage(value: number, full?: boolean) {
    const result_ = parsePriceBeverage(value, currency);
    const gift_ = promotionEnabled === IPromotionTypes.PromotionFreePours;

    if(value === 0)
      return (
        <>
          {full && <span id="info"> TOTAL </span>}
          <span>{result_}</span>
        </>
      );

    return (
      <>
        {(gift_ && full) && <img id="gift" src="icons/gift.svg" />}
        {(!gift_ && full) && <span id="info"> TOTAL </span>}
        <span id="value">{result_}</span>
        {gift_ &&
          <>
            {full && <span id="info"> TOTAL </span>}
            <span id="promotion">{`${full ? "0.00" : " 0"}`}{__(`c_${currency}`)}</span>
          </>
        }
      </>
    );
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
    promotionEnabled,
    currency,
    displayPriceBeverage,
    needToPay,
    canPour,
    statusPayment_,
    dataPayment_,
    cancelPayment
  };
});

export const PaymentProvider = withRouter(PaymentContainer.Provider);
export const PaymentContext = PaymentContainer.Context;