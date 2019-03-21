import * as React from "react";
import { __ } from "@utils/lib/i18n";
import styled, { css } from "styled-components";
import Gesture from "../Menu/Gesture";
import { Beverage, BeverageTypes, BeverageSize } from "../beverage/Beverage";
import { Grid } from "../global/Grid";
import { Button } from "../global/Button";
import { ConfigContext, ConsumerContext } from "@containers/index";
import { SegmentButton, SegmentButtonProps, SegmentButtonWrapper } from "../global/SegmentButton";

/* ==== COMPONENTS ==== */
/* ======================================== */

/* disabled?: boolean */
export const ChoiceBeverageWrap = styled.section`
  ${({ disabledWrap }) => disabledWrap && css`
    ${SegmentButtonWrapper} {
      display: none;
    }
    #nutrition-btn, #signin-btn, #logout-btn {
      opacity: .2;
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
`;

/* ==== ELEMENT ==== */
/* ======================================== */

interface ChoiceBeverageProps {
  onGesture: (gestureType: any) => void;
  selectBeverage: (b) => void;
  startPour: (b) => void;
  stopPour: () => void;
  goToPrepay: () => void;
  handleNutritionFacts: () => void;
  handleDisabled: (d) => void;
  nutritionFacts: boolean;
  idBeveragePouring_: number;
  isSparkling: boolean;
  disabled: boolean;
  segmentButton: SegmentButtonProps; // => _SegmentButton
}

export const ChoiceBeverage = (props: ChoiceBeverageProps) => {

  const { beverages } = React.useContext(ConfigContext);
  const { isLogged, resetConsumer } = React.useContext(ConsumerContext);

  const { idBeveragePouring_, onGesture, isSparkling, selectBeverage, startPour, stopPour, goToPrepay, disabled, handleNutritionFacts, nutritionFacts, handleDisabled } = props;

  return (
    <React.Fragment>
      <ChoiceBeverageWrap disabledWrap={disabled}>
        <SegmentButton {...props.segmentButton} disabled={disabled} />
        <Gesture onGesture={onGesture} />
        <Grid numElement={beverages.length}>
          {beverages.map((b, i) => {
            return (
              <Beverage
                key={i}
                pouring={b.beverage_id === idBeveragePouring_}
                type={isSparkling ? BeverageTypes.Sparkling : null}
                size={isLogged ? BeverageSize.Tiny : BeverageSize.Normal}
                color={b.beverage_font_color}
                beverage={b}
                logoId={b.beverage_logo_id}
                status_id={b.status_id}
                title={b.beverage_label_id}
                onStart={() => selectBeverage(b)}
                onHoldStart={() => startPour(b)}
                onHoldEnd={() => stopPour()}
                disabled={disabled}
                nutritionFacts={nutritionFacts}
                handleDisabled={handleDisabled}
              />
            );
          })}
        </Grid>
        <Button detectValue="nutrition-btn" disabled={disabled} onClick={() => handleNutritionFacts()} text={!isLogged ? "Nutrition" : null} icon={!nutritionFacts ? "nutrition" : "close"} />
        {!isLogged && <Button detectValue="signin-btn" disabled={disabled} onClick={() => goToPrepay()} text="Sign In" icon="qr-code" />}
        {isLogged && <Button detectValue="logout-btn" disabled={disabled} onClick={() => resetConsumer()} icon="log-out" />}
      </ChoiceBeverageWrap>
    </React.Fragment>
  );
};