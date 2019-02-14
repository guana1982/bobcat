import * as React from "react";
import { __ } from "@utils/lib/i18n";
import { CONSUMER_TIMER } from "@utils/constants";
import styled from "styled-components";

export const EndWrap = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.theme.primary};
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
  return (
    <React.Fragment>
      <EndWrap onClick={() => closeEndBeverage()}>
        <h1>{__("Enjoy!")}</h1>
      </EndWrap>
    </React.Fragment>
  );
};