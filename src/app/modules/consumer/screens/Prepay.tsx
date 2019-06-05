import * as React from "react";

import styled from "styled-components";
import { TimerContext } from "@containers/timer.container";
import { ConsumerContext } from "@containers/consumer.container";
import { Pages } from "@utils/constants";
import { AlertTypes, AlertContext } from "@core/containers/alert.container";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { CloseBtnWrap, CloseBtn } from "../components/common/CloseBtn";
import { __ } from "@core/utils/lib/i18n";
import { Subscription } from "rxjs";
import { ConfigContext } from "@core/containers";

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
    width: 259px;
    height: 259px;
    &.enable {
      background-color: #0000ff;
    }
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
    top: 595px;
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
  #Icon-Down {
    position: absolute;
    bottom: 70px;
    right: 234px;
  }
`;

interface PrepayProps {
  history: any;
}

let timer_: Subscription;
let consumerSocket_: Subscription;

export const Prepay = (props: PrepayProps) => {

  const [webcamReady, setWebcamReady] = React.useState<boolean>(false);

  const alertConsumer = React.useContext(AlertContext);
  const timerConsumer = React.useContext(TimerContext);
  const consumerConsumer = React.useContext(ConsumerContext);
  const configConsumer = React.useContext(ConfigContext);

  //  ==== TIMER ====>
  const { timerFull$ } = timerConsumer;
  const { isLogged } = consumerConsumer;

  function alertIsLogged(event) {
    if (isLogged) {
      alertConsumer.show({
        type: AlertTypes.EndBeverage,
        timeout: true,
        onDismiss: () => {
          consumerConsumer.resetConsumer(true);
          event();
        }
      });
    } else {
      event();
    }
  }

  const startTimer_ = () => {
    timer_ = timerFull$.subscribe(
      val => {
        if (val === "tap_detect") {
          startTimer_();
        } else if (val === "proximity_stop") {
          const event_ = () => consumerConsumer.resetConsumer();
          alertIsLogged(event_);
          return;
        }
        if (val === "timer_stop") {
          const event_ = () => props.history.push(Pages.Home);
          alertIsLogged(event_);
        }
      }
    );
  };

  const resetTimer_ = () => {
    timer_.unsubscribe();
  };
  //  <=== TIMER ====

  React.useEffect(() => {
    startTimer_();
    setTimeout(() => {
      mediumLevel.config.stopVideo().subscribe(); // <= STOP ATTRACTOR
      start();
      setTimeout(() => {
        setWebcamReady(true);
      }, 1500);
    }, 1500);
    return () => {
      resetTimer_();
      stop();
    };
  }, []);

  // ==== CONSUMER-SOCKET ===>
  const getObjectLength = obj => {
    const array = [];
    for (const key in obj) array.push(key);
    return array;
  };

  React.useEffect(() => {
    consumerSocket_ = configConsumer.socketAlarms$.subscribe(data => {
      data.message_type === "consumer_server_data"
      && getObjectLength(data.value).length === 0
      && alertConsumer.show({
        type: AlertTypes.ErrorUnassociatedBottle,
        subTitle: true,
        // timeout: true,
        onDismiss: () => console.log("ciao")
      });
    });
    return () => consumerSocket_.unsubscribe();
  }, []);
  // <=== CONSUMER-SOCKET ====

  const start = () => {
    const { startScanning } = consumerConsumer;
    startScanning()
    .subscribe((status: true | false | null) => { // => true: correct qr / false: error qr / null: data from server <=
      console.log(status);
      resetTimer_();
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
            startTimer_();
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
        <div id="Webcam" className={webcamReady && "enable"}>
          {!webcamReady && <img src={"animation/spinner-qr.gif"} />}
        </div>
        <img id="Bottle-QR" src={"img/bottle-qr.svg"} />
        <img id="Phone-QR" src={"img/phone-qr.svg"} />
        <h2 id="Text-Info">{__("c_prepay_text")}</h2>
        <img id="Icon-QR" src={"icons/qr-code.svg"} />
        <img id="Icon-Down" src={"icons/down.svg"} />
      </PrepayContent>
    </section>
  );

};