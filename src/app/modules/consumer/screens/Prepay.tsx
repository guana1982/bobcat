import * as React from "react";

import styled from "styled-components";
import { TimerContext, EventsTimer, StatusTimer } from "@containers/timer.container";
import { ConsumerContext } from "@containers/consumer.container";
import { Pages, TIMER_SIGN_IN } from "@utils/constants";
import { AlertTypes, AlertContext } from "@core/containers/alert.container";
import { CloseBtnWrap, CloseBtn } from "../components/common/CloseBtn";
import { __ } from "@core/utils/lib/i18n";
import { Subscription } from "rxjs";
import { ConfigContext, PaymentContext } from "@core/containers";
import { IdentificationConsumerStatus } from "@core/utils/APIModel";

export const PrepayContent = styled.div`
  background-color: #fff;
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
    top: 240px;
    right: 155px;
    width: 259px;
    height: 259px;
    background-color: #00f;
    &:before {
      content: " ";
      top: -35px;
      right: -35px;
      position: absolute;
      width: 330px;
      height: 330px;
      box-shadow: 0px 19px 31px -4px rgba(0,0,0,0.1);
    }
    .target { }
  }
  #Bottle-QR {
    position: absolute;
    top: 211.4px;
    left: 190px;
    width: 85px;
    height: 160px;
  }
  #Phone-QR {
    position: absolute;
    top: 406.5px;
    left: 190px;
    width: 85px;
    height: 107px;
  }
  #Scan-QR {
    position: absolute;
    width: 305.6px;
    height: 306px;
    top: 207px;
    left: 326.7px;
  }
  #Text-Info {
    font-family: NeuzeitGro-Bol;
    position: absolute;
    margin: 0;
    top: 579px;
    left: 226px;
    width: 361px;
    font-size: 18px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: ${props => props.theme.slateGrey}
  }
  #Text-Qr {
    position: absolute;
    font-family: NeuzeitGro-Bol;
    width: 223.3px;
    margin: 0;
    top: 579px;
    right: 172.7px;
    font-size: 18px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: ${props => props.theme.slateGrey}
  }
  #Icon-Down {
    position: absolute;
    width: 82px;
    height: 46px;
    bottom: 39px;
    right: 234px;
  }
`;

interface PrepayProps {
  history: any;
  location: any;
}

export const TIMEOUT_QR = 2000;

export const Prepay = (props: PrepayProps) => {

  const timer_ = React.useRef<Subscription>(null);
  const scanning_ = React.useRef<Subscription>(null);
  const consumerSocket_ = React.useRef<Subscription>(null);

  const timeoutDataFromServer_ = React.useRef(null);

  const [webcamReady, setWebcamReady] = React.useState<boolean>(false);

  const alertConsumer = React.useContext(AlertContext);
  const timerConsumer = React.useContext(TimerContext);
  const consumerConsumer = React.useContext(ConsumerContext);
  const configConsumer = React.useContext(ConfigContext);
  const paymentConsumer = React.useContext(PaymentContext);

  const { paymentModeEnabled } = paymentConsumer;
  const showAnimation = props.location.state ? props.location.state.showAnimation : false;

  //  ==== TIMER ====>
  const { timerNear$ } = timerConsumer;

  const startTimer_ = () => {
    resetTimer_();
    const { vendorConfig } = configConsumer;
    timer_.current = timerNear$(vendorConfig.timer_sign_in)
    .subscribe(
      val => {
        if (val === StatusTimer.TimerActive || val === StatusTimer.TimerInactive) {
          goToAttractor();
        } else if (val === StatusTimer.TimerNear) {
          alertConsumer.show({
            type: AlertTypes.ErrorQrNotFound,
            img: "img/qr-code-not-recognized.svg",
            subTitle: true,
            timeout: 3500,
            onDismiss: () => {}
          });
        }
      }
    );
  };

  const resetTimer_ = () => {
    if (timer_.current)
      timer_.current.unsubscribe();
  };
  //  <=== TIMER ====

  React.useEffect(() => {
    startTimer_();
    startReadQr();
    setTimeout(() => setWebcamReady(true), TIMEOUT_QR);
    return () => {
      resetTimer_();
      stopReadQr();
      if (scanning_.current) {
        scanning_.current.unsubscribe();
      }
      if (timeoutDataFromServer_.current) {
        clearTimeout(timeoutDataFromServer_.current);
      }
    };
  }, []);

  // ==== CONSUMER-SOCKET ===>
  const getObjectLength = obj => {
    const array = [];
    for (const key in obj) array.push(key);
    return array;
  };

  React.useEffect(() => {
    consumerSocket_.current = configConsumer.socketAlarms$.subscribe(data => {
      data.message_type === "consumer_server_data"
      && getObjectLength(data.value).length === 0
      && alertConsumer.show({
        type: AlertTypes.ErrorUnassociatedBottle,
        subTitle: true,
        timeout: true,
        onDismiss: () => {}
      });
    });
    return () => consumerSocket_.current.unsubscribe();
  }, []);
  // <=== CONSUMER-SOCKET ====

  const startReadQr = () => {
    const { startScanning } = consumerConsumer;

    if (scanning_.current)
      scanning_.current.unsubscribe();

    scanning_.current = startScanning()
    .subscribe((status: IdentificationConsumerStatus) => {
      resetTimer_();
      if (status !== IdentificationConsumerStatus.Loading) {
        if (scanning_.current)
          scanning_.current.unsubscribe();
      }

      if (status === IdentificationConsumerStatus.Complete) {
        goToHome();
      } else if (status === IdentificationConsumerStatus.ErrorQr) {
        alertConsumer.show({
          type: AlertTypes.ErrorQrNotValid,
          img: "img/qr-code-not-recognized.svg",
          subTitle: true,
          timeout: 3500,
          onDismiss: () => {
            goToHome();
          }
        });
      } else if (status === IdentificationConsumerStatus.Loading) {
        alertConsumer.show({
          type: AlertTypes.LoadingDataQr,
          timeout: false,
          lock: true,
          img: "animation/Loading_withBgCircle.gif",
          backgroung: "img/fruits-bg.webp"
        });
        timeoutDataFromServer_.current = setTimeout(() => {
          alertConsumer.show({
            type: !paymentModeEnabled ? AlertTypes.ErrorLoadingQr : AlertTypes.ErrorLoadingQrPayment,
            img: "img/cannot-connect-to-cloud.svg",
            subTitle: true,
            timeout: 3500,
            onDismiss: () => {
              goToHome();
            }
          });
        },  10000);
      } else if (status === IdentificationConsumerStatus.CompleteLoading) {
        alertConsumer.hide();
        goToHome();
      }  else if (status === IdentificationConsumerStatus.NotAssociatedBottle) {
        alertConsumer.show({
          type: AlertTypes.ErrorUnassociatedBottle,
          img: "img/qr-code-not-associated-with-account.png",
          subTitle: true,
          timeout: 3500,
          onDismiss: () => {
            goToHome();
          }
        });
      } else {
        alertConsumer.show({
          type: status,
          subTitle: true,
          timeout: true,
          onDismiss: () => {
            goToHome();
          }
        });
      }
    });
  };

  const goToAttractor = () => {
    props.history.push(Pages.Attractor);
  };

  const goToHome = () => {
    props.history.push(Pages.Home);
  };

  const stopReadQr = () => {
    const { stopScanning } = consumerConsumer;
    stopScanning().subscribe();
  };

  return (
    <section>
      <PrepayContent>
        <CloseBtn detectValue={"prepay_close"} icon={"close"} onClick={() => goToHome()} />
        <div id="Webcam">
        {(!webcamReady && showAnimation) &&
          <img className="loader" src={`animation/qr_loader.gif?x=${Math.random()}`} />
        }
        </div>
        <img id="Bottle-QR" src={"img/bottle-qr.svg"} />
        <img id="Phone-QR" src={"img/phone-qr.svg"} />
        <img id="Scan-QR" src={"img/scan-qr-code-tip.svg"} />
        <h2 id="Text-Info">{__("c_prepay_text")}</h2>
        <h2 id="Text-Qr">{__("c_qr_text")}</h2>
        <img id="Icon-Down" src={"icons/down.svg"} />
      </PrepayContent>
    </section>
  );

};