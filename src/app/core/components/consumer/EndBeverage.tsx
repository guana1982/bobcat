import * as React from "react";
import { __ } from "@utils/lib/i18n";
import { CONSUMER_TIMER } from "@utils/constants";
import styled from "styled-components";
import { AccessibilityContext } from "@core/containers";

export const EndWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.theme.slateGrey};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  h1 {
    color: ${props => props.theme.light};
    font-size: 4rem;
  }
`;

/* ==== ELEMENT ==== */
/* ======================================== */

interface EndBeverageProps {
  resetBeverage: any;
}

export const EndBeverage = (props: EndBeverageProps) => {

  const { resetBeverage } = props;

  const endBeverageTimeout = setTimeout(() => resetBeverage(), CONSUMER_TIMER.END_VIEW);
  const closeEndBeverage = () => {
    clearTimeout(endBeverageTimeout);
    resetBeverage();
  };

  //  ==== ACCESSIBILITY FUNCTION ====>
  const accessibilityConsumer = React.useContext(AccessibilityContext);
  const { changeStateLayout, enter } = accessibilityConsumer;

  React.useEffect(() => {
    changeStateLayout({
      endBeverageShow: true
    });
    return () => {
      changeStateLayout({
        endBeverageShow: false
      });
    };
  }, []);

  React.useEffect(() => {
    if (enter) {
      closeEndBeverage();
    }
  }, [enter]);
  //  <=== ACCESSIBILITY FUNCTION ====

  return (
    <React.Fragment>
      <EndWrap onClick={() => closeEndBeverage()}>
        <h1>{__("Enjoy!")}</h1>
      </EndWrap>
    </React.Fragment>
  );
};