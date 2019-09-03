import * as React from "react";
import styled, { css } from "styled-components";
import { ConfigContext, ConsumerContext, AlertTypes, PaymentContext, PaymentStatus, PaymentStatusCancel } from "@containers/index";
import Gesture from "@core/components/Menu/Gesture";
import { Beverage, BeverageTypes, BeverageSize } from "../beverage/Beverage";
import { SegmentButtonWrapper, SegmentButtonProps, SegmentButton } from "../common/SegmentButton";
import { Button } from "../common/Button";
import { Grid } from "../common/Grid";
import { Alert } from "../common/Alert";
import { MessageInfo } from "../common/MessageInfo";
import { IBeverage } from "@core/models";
import { ReplaySubscription } from "../common/Subscription";
import { IPourConfig } from "@core/models/vendor.model";

/* ==== COMPONENTS ==== */
/* ======================================== */

/* disabled?: boolean */
export const ChoiceBeverageWrap = styled.section`
  ${({ disabledWrap }) => disabledWrap && css`
    ${SegmentButtonWrapper} {
      display: none;
    }
    #nutrition-btn, #signin-btn, #logout-btn {
      opacity: 0;
    }
  `}
  ${({ blurWrap }) => blurWrap && css`
    #nutrition-btn, #signin-btn, #logout-btn {
      opacity: 0;
    }
  `}
  #nutrition-btn {
    position: absolute;
    left: 22px;
    bottom: 22px;
  }
  #signin-btn, #logout-btn {
    position: absolute;
    right: 22px;
    bottom: 22px;
  }
  #logout-btn {
    #icon {
      margin-left: 2px;
    }
  }
  .consumer-btns.cancel-payment {
    #signin-btn {
      right: 95px;
      width: 80px;
    }
    #logout-btn {
      right: 15px;
      width: 80px;
    }
  }
`;

/* ==== ELEMENT ==== */
/* ======================================== */

interface ChoiceBeverageProps {
  onGesture: (gestureType: any) => void;
  selectBeverage: (b) => void;
  startPour: (config: IPourConfig) => void;
  showPayment: () => any;
  stopPour: () => void;
  goToPrepay: () => void;
  handleType: (v: boolean) => void;
  handleNutritionFacts: () => void;
  handleDisabled: (d) => void;
  beverages: IBeverage[];
  nutritionFacts: boolean;
  idBeveragePouring_: number;
  isSparkling: boolean;
  disabled: boolean;
  fullMode: boolean;
  beverageSelected: any;
  segmentButton: SegmentButtonProps; // => _SegmentButton
  signedOut: () => void;
}

export const ChoiceBeverage = (props: ChoiceBeverageProps) => {
  const { beverages, signedOut } = props;
  const { statusAlarms } = React.useContext(ConfigContext);
  const { isLogged } = React.useContext(ConsumerContext);
  const { socketPayment$, cancelPayment } = React.useContext(PaymentContext);

  const { idBeveragePouring_, onGesture, isSparkling, selectBeverage, startPour, stopPour, goToPrepay, disabled, handleNutritionFacts, nutritionFacts, handleDisabled, fullMode, handleType, beverageSelected } = props;

  const disableSparkling_ = isSparkling && statusAlarms.alarmSparkling_;

  const logout = (cancelPayment_?: boolean) => {
    if (cancelPayment_) {
      cancelPayment();
      return;
    }
    signedOut();
  };

  return (
    <React.Fragment>
      <ChoiceBeverageWrap disabledWrap={disabled}>
        {!nutritionFacts && <SegmentButton {...props.segmentButton} disabled={disabled} />}
        <Gesture onGesture={onGesture} />
        {(disableSparkling_ && !beverageSelected) && <Alert
          options = {{
            type: AlertTypes.EndSparkling,
            subTitle: true,
            timeout: true,
            transparent: true,
            onConfirm: () => handleType(false),
            onDismiss: () => handleType(false),
          }}
        />}
        <Grid numElement={beverages.length}>
          {beverages.map((b, i) => {
            return (
              <Beverage
                key={i}
                pouring={b.beverage_id === idBeveragePouring_}
                types={isSparkling ? [BeverageTypes.Sparkling] : null}
                size={(isLogged && !fullMode) ? BeverageSize.Tiny : BeverageSize.Normal}
                color={b.beverage_font_color}
                beverage={b}
                logoId={b.beverage_logo_id}
                status_id={b.status_id}
                title={b.beverage_label_id}
                onStart={() => selectBeverage(b)}
                onHoldStart={(from) => startPour({params: { beverageSelected: b }, from: from})}
                onHoldEnd={() => stopPour()}
                disabled={disabled || disableSparkling_}
                nutritionFacts={nutritionFacts}
                handleDisabled={handleDisabled}
              />
            );
          })}
        </Grid>
        {(!disableSparkling_ && !beverageSelected) && <>
          <MessageInfo disabled={nutritionFacts || disabled} />
          <Button detectValue="nutrition-btn" disabled={disabled || disableSparkling_} onClick={handleNutritionFacts} text="c_nutrition" icon={!nutritionFacts ? "nutrition" : "close"} />
          <ReplaySubscription source={socketPayment$.current}>
            {(status: PaymentStatus) => {
              const cancelPayment_ = status in PaymentStatusCancel;
              return (
                <div className={`consumer-btns ${cancelPayment_ ? "cancel-payment" : ""}`}>
                  {!isLogged && <Button detectValue="signin-btn" disabled={disabled} onClick={goToPrepay} text="c_sign_in" icon="qr-code" />}
                  {(isLogged || cancelPayment_) && <Button detectValue="logout-btn" disabled={disabled} onClick={() => logout(cancelPayment_)} text="c_done" icon="log-out" />}
                </div>
              );
            }}
          </ReplaySubscription>
        </>}
      </ChoiceBeverageWrap>
    </React.Fragment>
  );
};