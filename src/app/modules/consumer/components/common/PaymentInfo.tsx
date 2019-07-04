
import * as React from "react";
import styled from "styled-components";
import { __ } from "@core/utils/lib/i18n";
import { PaymentContext, PaymentStatus } from "@core/containers";
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
  const paymentConsumer = React.useContext(PaymentContext);
  const { socketPayment$, paymentModeEnabled } = paymentConsumer;
  return (
    <PaymentInfoWrap className={disabled ? "disabled" : ""}>
      {
        paymentModeEnabled &&
        <ReplaySubscription source={socketPayment$.current}>
          {(status: PaymentStatus) => <span id="payment-status">{status}</span>}
        </ReplaySubscription>
      }
    </PaymentInfoWrap>
  );
};