import * as React from "react";
import styled, { keyframes } from "styled-components";
import Circle from "react-circle";
import { ModalContentProps } from "@modules/service/components/Modal";

const CleaningContent = styled.div`
  display: flex;
  width: 100vw;
  height: calc(100vh - 115px);
  #circle-wrap {
    padding: 0px;
    width: 35vw;
    height: 35vw;
    margin: auto;
    border-radius: 50%;
    background: #fff;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      font-size: 6rem;
      font-weight: bold;
      color: #222;
    }
    svg {
      position: absolute;
      top: -5%;
      left: -5%;
      width: 110%;
      height: 110%;
    }
  }
`;

interface CleaningProps extends ModalContentProps {

}

const TIMER_MAX = 30;
let intervalTimer_ = null;

const CleaningComponent = (props: CleaningProps) => {

  const [timer, setTimer] = React.useState<number>(TIMER_MAX);

  React.useEffect(() => {
    intervalTimer_ = setInterval(() => setTimer(prevTimer => (prevTimer - 1)), 1000);
  }, []);

  React.useEffect(() => {
    if (timer === 0) {
      clearInterval(intervalTimer_);
      intervalTimer_ = null;
    }
  }, [timer]);

  const endTimer = () => props.cancel();

  return (
    <CleaningContent>
      <div id="circle-wrap">
        <Circle
          animate={true}
          animationDuration={`${TIMER_MAX}s`}
          responsive={true}
          progress={timer === TIMER_MAX ? 100 : 0}
          progressColor="#222"
          bgColor="#fff"
          textColor="#222"
          percentSpacing={10}
          showPercentage={false}
          onAnimationEnd={endTimer}
        />
        <span>{timer}</span>
      </div>
    </CleaningContent>
  );
};

export default CleaningComponent;
