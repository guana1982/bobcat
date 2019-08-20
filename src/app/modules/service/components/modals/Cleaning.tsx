import * as React from "react";
import styled, { keyframes } from "styled-components";
import Circle from "react-circle";
import { ModalContentProps, Modal } from "@modules/service/components/common/Modal";
import { __ } from "@core/utils/lib/i18n";

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

interface CleaningProps extends Partial<ModalContentProps> {

}

const TIMER_MAX = 30;
let intervalTimer_ = null;

export const Cleaning = (props: CleaningProps) => {

  const { cancel } = props;

  const [timer, setTimer] = React.useState<number>(TIMER_MAX);

  const endTimer = () => props.cancel();

  React.useEffect(() => {
    intervalTimer_ = setInterval(() => setTimer(prevTimer => (prevTimer - 1)), 1000);
  }, []);

  React.useEffect(() => {
    if (timer === 0) {
      clearInterval(intervalTimer_);
      intervalTimer_ = null;
      setTimeout(() => endTimer(), 1000);
    }
  }, [timer]);


  return (
    <Modal
      show={true}
      cancel={cancel}
      title={__("Screen Cleaning")}
      subTitle={__("SCREEN WILL CLOSE IN 30 SECONDS REMEBER TO DRY SCREEN")}
      actions={[]}
    >
      <CleaningContent>
        <div id="circle-wrap">
          {/* <Circle
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
          /> */}
          <span>{timer}</span>
        </div>
      </CleaningContent>
    </Modal>
  );
};