import * as React from "react";
import CountUp from "react-countup";
import styled from "styled-components";
import { themeMain } from "@style";

const StyledCountUp = styled.div`
  @keyframes bounce {
    0% { transform: scale(1); top: 90px; }
    25% { transform: scale(1.2); top: 90px; }
    50% { transform: scale(1); top: 90px; }
    100% { top: 70px; }
  }
  @keyframes bounce2 {
    0% { height: 0; }
    25% { height: 0; }
    50% { height: 0; }
    100% { height: 28px; }
  }
  /* background: #fff; */
  width: 425px;
  height: 322px;
  font-size: 30px;
  color: ${themeMain.primary};
  position: absolute;
  top: 216px;
  left: 517px;
  svg {
    transform: scale(4);
    position: absolute;
    top: 137px;
    left: 138px;
  }
  .countUpWrapper {
    position: absolute;
    top: 90px;
    left: 50px;
    span {
      font-size: 125px;
      font-family: NeuzeitGro-Bol;
    }
    &.animated {
      /* top: 85px;
      transition-duration: 1s; */
      animation: bounce 2s;
      animation-fill-mode: forwards;
        /* timing-function delay iteration-count direction fill-mode; */
    }
  }
  .savedBottles {
    position: absolute;
    left: 50px;
    height: 0;
    overflow: hidden;
    font-family: NeuzeitGro-Bol;
    &.bottles { bottom: 115px; }
    &.saved { bottom: 86px; }
    &.animated {
      animation: bounce2 2s;
      animation-fill-mode: forwards;
    }
  }
`;


export const CountUpComponent = () => {

  const [countUpEnded, setCountUpState] = React.useState(false);

  return (
    <StyledCountUp>
      <div className="countUp">
        {/* <div className="innerCountUp"> */}
          {/* <svg width={14} height={35} fill={themeMain.primary}>
            <path
              id="prefix__bb"
              d="M9.049 0H4.535c-.967 0-1.693.76-1.693 1.773v1.519c0 .59.322 1.182.806 1.435L.907 8.777C-.06 10.297.02 11.562.02 13.249a3 3 0 0 0 1.129 2.363c-1.532 1.182-1.532 3.544 0 4.726-1.532 1.182-1.532 3.544 0 4.725C.504 25.57.02 26.414.02 27.343v3.374c0 2.28 1.774 4.135 3.95 4.135h5.64c2.096 0 3.869-1.857 3.869-4.135v-3.375c0-.928-.403-1.772-1.129-2.279 1.532-1.181 1.532-3.543 0-4.725 1.532-1.182 1.532-3.544 0-4.726.726-.506 1.129-1.435 1.129-2.363 0-1.688.161-2.953-.887-4.472l-2.66-4.05c.483-.253.725-.844.725-1.435v-1.52C10.658.76 9.932 0 9.046 0h.003zm3.55 27.218v3.569c0 1.696-1.214 3.123-2.752 3.123H4.182c-1.538 0-2.832-1.428-2.832-3.123v-3.57c0-.981.729-1.785 1.7-1.785h7.85c.971 0 1.7.804 1.7 1.786h-.001zM10.9 24.49H3.05c-2.267 0-2.267-3.767 0-3.767h7.85c2.267 0 2.267 3.767 0 3.767zm0-4.71H3.05c-2.267 0-2.267-3.767 0-3.767h7.85c2.267 0 2.267 3.768 0 3.768zm1.04-10.504c.808 1.317.647 2.459.647 3.95 0 1.055-.727 1.845-1.696 1.845H3.058c-.97 0-1.697-.79-1.697-1.844 0-1.493-.161-2.635.727-3.951L4.995 4.71H8.95l2.987 4.566h.003zM9.226 1.56v1.59c0 .353-.321.618-.563.618h-4.5c-.32 0-.562-.265-.562-.618V1.56c0-.353.241-.618.563-.618h4.5c.24 0 .562.265.562.618z"
            />
          </svg> */}
          <div className={`countUpWrapper ${countUpEnded && "animated"}`}>
            <CountUp
              start={0}
              end={4732}
              onEnd={() => setCountUpState(true)}
            />
          </div>
          <span className={`savedBottles bottles ${countUpEnded && "animated"}`}>Bottles</span>
          <span className={`savedBottles saved ${countUpEnded && "animated"}`}>Saved</span>
        {/* </div> */}
      </div>
    </StyledCountUp>
  );
};