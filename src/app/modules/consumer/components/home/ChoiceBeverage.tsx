import * as React from "react";
import styled, { css } from "styled-components";
import { ConfigContext, ConsumerContext } from "@containers/index";
import Gesture from "@core/components/Menu/Gesture";
import { Beverage, BeverageTypes, BeverageSize } from "../beverage/Beverage";
import { SegmentButtonWrapper, SegmentButtonProps, SegmentButton } from "../common/SegmentButton";
import { Grid } from "@modules/service/service.style";
import { Button } from "../common/Button";

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
  fullMode: boolean;
  segmentButton: SegmentButtonProps; // => _SegmentButton
}

export const ChoiceBeverage = (props: ChoiceBeverageProps) => {

  const { beverages } = React.useContext(ConfigContext);
  const { isLogged, resetConsumer } = React.useContext(ConsumerContext);

  const { idBeveragePouring_, onGesture, isSparkling, selectBeverage, startPour, stopPour, goToPrepay, disabled, handleNutritionFacts, nutritionFacts, handleDisabled, fullMode } = props;

  return (
    <React.Fragment>
      <ChoiceBeverageWrap disabledWrap={disabled}>
        {!nutritionFacts && <SegmentButton {...props.segmentButton} disabled={disabled} />}
        <Gesture onGesture={onGesture} />
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
                onHoldStart={() => startPour(b)}
                onHoldEnd={() => stopPour()}
                disabled={disabled}
                nutritionFacts={nutritionFacts}
                handleDisabled={handleDisabled}
              />
            );
          })}
        </Grid>
        <Button detectValue="nutrition-btn" disabled={disabled} onClick={() => handleNutritionFacts()} text={"Nutrition"} icon={!nutritionFacts ? "nutrition" : "close"} />
        {!isLogged && <Button detectValue="signin-btn" disabled={disabled} onClick={() => goToPrepay()} text="Sign In" icon="qr-code" />}
        {isLogged && <Button detectValue="logout-btn" disabled={disabled} onClick={() => resetConsumer()} text="Sign Out" icon="log-out" />}
      </ChoiceBeverageWrap>
    </React.Fragment>
  );
};