import * as React from "react";
import { __ } from "@utils/lib/i18n";
import styled from "styled-components";
import Gesture from "../Menu/Gesture";
import { Beverage, BeverageTypes } from "../global/Beverage";
import { Grid } from "../global/Grid";
import { Footer } from "../global/Footer";
import { Button } from "../global/Button";
import { ConfigContext, ConsumerContext } from "@containers/index";

/* ==== COMPONENTS ==== */
/* ======================================== */

export const ChoiceBeverageWrap = styled.section`
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
  idBeveragePouring_: number;
  isSparkling: boolean;
  disabled: boolean;
}

export const ChoiceBeverage = (props: ChoiceBeverageProps) => {

  const { beverages } = React.useContext(ConfigContext);
  const { isLogged, resetConsumer } = React.useContext(ConsumerContext);

  const { idBeveragePouring_, onGesture, isSparkling, selectBeverage, startPour, stopPour, goToPrepay, disabled } = props;

  return (
    <React.Fragment>
      <ChoiceBeverageWrap>
        <Gesture onGesture={onGesture} />
        <Grid numElement={beverages.length}>
          {beverages.map((b, i) => {
            return (
              <Beverage
                key={i}
                pouring={b.beverage_id === idBeveragePouring_}
                type={isSparkling ? BeverageTypes.Sparkling : null}
                beverage={b}
                status_id={b.status_id}
                title={b.beverage_label_id}
                onStart={() => selectBeverage(b)}
                onHoldStart={() => startPour(b)}
                onHoldEnd={() => stopPour()}
                disabled={disabled}
              />
            );
          })}
        </Grid>
        <Button detectValue="nutrition-btn" disabled={disabled} onClick={() => console.log("Nutrition")} text={!isLogged ? "Nutrition" : null} icon="nutrition" />
        {!isLogged && <Button detectValue="signin-btn" disabled={disabled} onClick={() => goToPrepay()} text="Sign In" icon="qr-code" />}
        {isLogged && <Button detectValue="logout-btn" disabled={disabled} onClick={() => resetConsumer()} icon="log-out" />}
      </ChoiceBeverageWrap>
    </React.Fragment>
  );
};