import * as React from "react";

import styled from "styled-components";
import { TimerContext } from "@containers/timer.container";
import { ConsumerContext } from "@containers/consumer.container";
import { Pages } from "@utils/constants";
import { AlertTypes, AlertContext } from "@core/containers/alert.container";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { CloseBtnWrap, CloseBtn } from "../components/common/CloseBtn";

export const PrepayContent = styled.div`
  background-image: ${props => props.theme.backgroundLight};
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  ${CloseBtnWrap} {
    position: absolute;
    top: 26.5px;
    right: 27px;
  }
  #Webcam {
    position: absolute;
    top: 261px;
    left: 209px;
    width: 257px;
    height: 259px;
    background-color: #0000ff;
    &:before {
      content: " ";
      position: absolute;
      top: -15%;
      left: -15%;
      width: 130%;
      height: 130%;
      box-shadow: 0px 19px 31px -4px rgba(0,0,0,0.1);
    }
  }
  #Bottle-QR {
    position: absolute;
    top: 154px;
    left: 700px;
    width: 190px;
    height: 355px;
  }
  #Phone-QR {
    position: absolute;
    top: 272.2px;
    right: 180.6px;
    width: 190px;
    height: 237px;
  }
  #Text-Info {
    font-family: NeuzeitGro-Bol;
    position: absolute;
    margin: 0;
    top: 585px;
    left: 715px;
    width: 232px;
    height: 97px;
    font-size: 20px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: ${props => props.theme.slateGrey}
  }
  #Icon-QR {
    position: absolute;
    top: 599px;
    right: 223px;
    width: 48px;
    height: 48px;
  }
  #Icon-Arrow {
    width: 48px;
    height: 48px;
  }
`;

interface PrepayProps {
  history: any;
}

export const Prepay = (props: PrepayProps) => {

  const alertConsumer = React.useContext(AlertContext);
  const timerConsumer = React.useContext(TimerContext);
  const consumerConsumer = React.useContext(ConsumerContext);

  React.useEffect(() => {
    mediumLevel.config.stopVideo().subscribe(); // <= STOP ATTRACTOR
    timerConsumer.startTimer();
    start();
    return () => {
      timerConsumer.resetTimer();
      stop();
    };
  }, []);

  const start = () => {
    const { startScanning } = consumerConsumer;
    startScanning()
    .subscribe((status: true | false | null) => { // => true: correct qr / false: error qr / null: data from server <=
      timerConsumer.clearTimer();
      if (status === true) {
        alertConsumer.show({
          type: AlertTypes.Success,
          timeout: true,
          onDismiss: () => {
            goToHome();
          }
        });
      } else if (status === false) {
        alertConsumer.show({
          type: AlertTypes.Error,
          timeout: true,
          onDismiss: () => {
            start();
          }
        });
      }
    });
  };

  const goToHome = () => {
    props.history.push(Pages.Home);
  };

  const stop = () => {
    const { stopScanning } = consumerConsumer;
    stopScanning().subscribe();
  };

  return (
    <section>
      <PrepayContent>
        <CloseBtn detectValue={"prepay_close"} icon={"close"} onClick={() => goToHome()} />
        <div id="Webcam" />
        <img id="Bottle-QR" src={"img/bottle-qr.svg"} />
        <img id="Phone-QR" src={"img/phone-qr.svg"} />
        <h2 id="Text-Info">Display the code on your phone or bottle and place it below. </h2>
        <img id="Icon-QR" src={"icons/qr-code.svg"} />
      </PrepayContent>
    </section>
  );

};