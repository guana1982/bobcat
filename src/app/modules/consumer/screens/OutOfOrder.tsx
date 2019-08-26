import * as React from "react";

import styled from "styled-components";
import { ConfigContext, TimerContext } from "@core/containers";
import { HomeContent } from "./Home";
import Gesture from "@core/components/Menu/Gesture";
import { __ } from "@core/utils/lib/i18n";
import { Subscription } from "rxjs";
import { Pages } from "@core/utils/constants";

interface OutOfOrderProps {
  className: any;
}

export const WrapOutOfOrder_ = (props: OutOfOrderProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <img id="machine" src={"img/out-of-order.svg"} />
      <h2 id="title">{__("c_out_of_order_title")}</h2>
      <h2 id="text">{__("c_out_of_order_text")}</h2>
    </div>
  );
};

export const WrapOutOfOrder = styled(WrapOutOfOrder_)`
  #machine {
    position: absolute;
    top: 187px;
    left: 250.6px;
    width: 432px;
    height: 458px;
  }
  #title {
    position: absolute;
    top: 324px;
    right: 216.4px;
    width: 271px;
    height: 37.5px;
    color: ${props => props.theme.slateGrey};
    font-family: NeuzeitGro-Bol;
    text-transform: uppercase;
    font-size: 20px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.88;
    letter-spacing: 1.6px;
  }
  #text {
    position: absolute;
    margin: 0;
    line-height: 1.2;
    top: 389px;
    right: 270.4px;
    width: 217px;
    height: 73px;
    color: ${props => props.theme.slateGrey};
    font-family: NeuzeitGro-Reg;
    font-size: 22px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: normal;
  }
`;

export const OutOfOrder = (props) => {

  const configConsumer = React.useContext(ConfigContext);

  const onGesture = (gestureType) => {
    if (gestureType === "p")
      configConsumer.setAuthService(true);
  };

  //  ==== TIMER ====>
  const timerConsumer = React.useContext(TimerContext);
  const { timerOutOfOrder$ } = timerConsumer;
  const timer_ = React.useRef<Subscription>(null);
  const startTimer_ = () => {
    resetTimer_();
    timer_.current = timerOutOfOrder$.subscribe(
      val => {
        if (val) { //  === StatusProximity.TimerStop
          props.history.push(Pages.Attractor);
        }
      }
    );
  };

  const resetTimer_ = () => {
    if (timer_.current)
      timer_.current.unsubscribe();
  };

  React.useEffect(() => {
    startTimer_();
    return () => {
      resetTimer_();
    };
  }, []);
  //  <=== TIMER ====

  return (
    <HomeContent>
      <Gesture onGesture={onGesture} />
      <WrapOutOfOrder />
    </HomeContent>
  );

};