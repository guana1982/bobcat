import * as React from "react";

import styled from "styled-components";
import { TimerContext, EventsTimer } from "@containers/timer.container";
import { ConsumerContext } from "@containers/consumer.container";
import { Pages } from "@utils/constants";
import { AlertTypes, AlertContext } from "@core/containers/alert.container";
import { CloseBtnWrap, CloseBtn } from "../components/common/CloseBtn";
import { __ } from "@core/utils/lib/i18n";
import { Subscription } from "rxjs";
import { ConfigContext, PaymentContext } from "@core/containers";
import { IdentificationConsumerStatus } from "@core/utils/APIModel";
import { debounceTime } from "rxjs/operators";
import { Alert } from "../components/common/Alert";

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
    top: 240px;
    right: 155px;
    width: 259px;
    height: 259px;
    background-color: #000;
    &.enable {
      background-color: #0000ff;
    }
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

  //  ==== TIMER ====>
  const { timerPrepay$ } = timerConsumer;
  // const { isLogged } = consumerConsumer;

  // function alertIsLogged(event) {
  //   if (isLogged) {
  //     alertConsumer.show({
  //       type: AlertTypes.EndBeverage,
  //       timeout: true,
  //       onDismiss: () => {
  //         consumerConsumer.resetConsumer(true);
  //         event();
  //       }
  //     });
  //   } else {
  //     event();
  //   }
  // }

  const startTimer_ = () => {
    resetTimer_();
    timer_.current = timerPrepay$.subscribe(
      val => {
        if (val === EventsTimer.TimerStop) {
          // const event_ = () => {
          //   consumerConsumer.resetConsumer(true);
          //   goToHome();
          // };
          // alertIsLogged(event_);
          alertConsumer.show({
            type: AlertTypes.ErrorQrNotFound,
            img: "img/qr-code-not-recognized.svg",
            subTitle: true,
            timeout: true,
            onDismiss: () => {
              goToHome();
            }
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
        // timeout: true,
        onDismiss: () => console.log("ciao")
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
    // .pipe(
    //   debounceTime(500),
    // )
    .subscribe((status: IdentificationConsumerStatus) => {
      resetTimer_();
      if (status !== IdentificationConsumerStatus.Loading) {
        if (scanning_.current)
          scanning_.current.unsubscribe();
      }

      if (status === IdentificationConsumerStatus.Complete) {
        // alertConsumer.show({
        //   type: AlertTypes.Success,
        //   timeout: true,
        //   onDismiss: () => {
        //     goToHome();
        //   }
        // });
        goToHome();
      } else if (status === IdentificationConsumerStatus.ErrorQr) {
        alertConsumer.show({
          type: AlertTypes.ErrorQrNotFound,
          img: "img/qr-code-not-recognized.svg",
          subTitle: true,
          timeout: true,
          onDismiss: () => {
            goToHome();
          }
        });
      } else if (status === IdentificationConsumerStatus.Loading) {
        alertConsumer.show({
          type: AlertTypes.LoadingDataQr,
          timeout: false,
          lock: true,
        });
        timeoutDataFromServer_.current = setTimeout(() => {
          alertConsumer.show({
            type: !paymentModeEnabled ? AlertTypes.ErrorLoadingQr : AlertTypes.ErrorLoadingQrPayment,
            img: "img/cannot-connect-to-cloud.svg",
            subTitle: true,
            timeout: true,
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
          timeout: true,
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
        <div id="Webcam" className={webcamReady ? "enable" : ""}>
          {/* <img className="target" src={"img/target.svg"} /> */}
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