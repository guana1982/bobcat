
import * as React from "react";
import styled from "styled-components";
import { __ } from "@core/utils/lib/i18n";
import { PaymentContext, PaymentStatus, ConfigContext } from "@core/containers";
import { ReplaySubscription } from "./Subscription";

export const MessageInfoWrap = styled.div`
  &.disabled {
    display: none;
  }
`;

interface MessageInfoProps {
 disabled?: boolean;
}

export const MessageInfo = (props: MessageInfoProps) => {
  const { disabled } = props;

  const configConsumer = React.useContext(ConfigContext);
  const { statusAlarms } = configConsumer;

  const paymentConsumer = React.useContext(PaymentContext);
  const { socketPayment$, paymentModeEnabled, promotionEnabled } = paymentConsumer;

  return (
    <MessageInfoWrap className={disabled ? "disabled" : ""}>
      {
        (paymentModeEnabled && !promotionEnabled)
          ? (<ReplaySubscription source={socketPayment$.current}>
              {(status: PaymentStatus) => {
                if (statusAlarms.alarmPayment_) {
                  return (
                    <span id="message-status">{__(`p_payment_system_down`)}</span>
                  );
                }

                return (
                  <span id="message-status">{__(`p_${status}`)}</span> // ${dataPayment_.current ? `-${dataPayment_.current}` : ""}
                );
              }}
            </ReplaySubscription>)
          : <span id="message-status">{__("c_tap_to_pour")}</span>
      }
    </MessageInfoWrap>
  );
};