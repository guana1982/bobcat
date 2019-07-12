
import * as React from "react";
import styled from "styled-components";
import { __ } from "@core/utils/lib/i18n";
import { PaymentContext, PaymentStatus, ConfigContext } from "@core/containers";
import { ReplaySubscription } from "./Subscription";

export const PaymentInfoWrap = styled.div`
  &.disabled {
    display: none;
  }
`;

interface PaymentInfoProps {
 disabled?: boolean;
}

export const PaymentInfo = (props: PaymentInfoProps) => {
  const { disabled } = props;

  const configConsumer = React.useContext(ConfigContext);
  const { statusAlarms } = configConsumer;

  const paymentConsumer = React.useContext(PaymentContext);
  const { socketPayment$, paymentModeEnabled, dataPayment_ } = paymentConsumer;

  return (
    <PaymentInfoWrap className={disabled ? "disabled" : ""}>
      {
        paymentModeEnabled &&
        <ReplaySubscription source={socketPayment$.current}>
          {(status: PaymentStatus) => {
            if (statusAlarms.alarmPayment_) {
              return (
                <span id="payment-status">{__(`c_payment_system_down`)}</span>
              );
            }

            return (
              <span id="payment-status">{__(`c_${status.toLowerCase()}`)}</span> // ${dataPayment_.current ? `-${dataPayment_.current}` : ""}
            );
          }}
        </ReplaySubscription>
      }
    </PaymentInfoWrap>
  );
};