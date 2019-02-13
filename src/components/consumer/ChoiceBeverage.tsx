import * as React from "react";
import { __ } from "../../utils/lib/i18n";
import styled from "styled-components";
import Gesture from "../Menu/Gesture";
import { Beverage, BeverageTypes } from "../global/Beverage";
import { Grid } from "../global/Grid";
import { Footer } from "../global/Footer";
import { Button, ButtonTypes } from "../global/Button";
import { ConfigContext } from "../../store/config.store";
import { ConsumerContext } from "../../store/consumer.store";
import { FocusElm } from "../../store/accessibility.store";

/* ==== COMPONENTS ==== */
/* ======================================== */

export const ChoiceBeverageWrap = styled.section``;

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
}

export const ChoiceBeverage = (props: ChoiceBeverageProps) => {

  const { beverages } = React.useContext(ConfigContext);
  const { isLogged, resetConsumer } = React.useContext(ConsumerContext);

  const { idBeveragePouring_, onGesture, isSparkling, selectBeverage, startPour, stopPour, goToPrepay } = props;

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
                dataBtnFocus={i === 0 ? FocusElm.Init : null}
              />
            );
          })}
        </Grid>
      </ChoiceBeverageWrap>
      <Footer>
        {!isLogged && <Button data-focus={[3, 0]} type={ButtonTypes.Transparent} onClick={() => goToPrepay()} text="SIGN IN" icon="logout" />}
        {isLogged && <Button data-focus={[3, 0]} type={ButtonTypes.Transparent} onClick={() => resetConsumer()} text="SIGN OUT" icon="logout" />}
      </Footer>
    </React.Fragment>
  );
};