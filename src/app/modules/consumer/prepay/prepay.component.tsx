import * as React from "react";

import { QrSquare, Webcam, PrepayContent, Header, SectionWrap, SectionContent } from "./prepay.style";
import { CircleBtn } from "@components/global/CircleBtn";
import { TimerContext } from "@containers/timer.container";

// import { Alert, AlertTypes, AlertProps } from "@components/global/Alert";
import { ConsumerContext } from "@containers/consumer.container";
import { Pages } from "@utils/constants";
import { AlertTypes, AlertContext } from "@core/containers/alert.container";

interface PrepayProps {
  history: any;
}

// interface PrepayState {}

export const Prepay = (props: PrepayProps) => {

  // const [state, setState] = React.useState<PrepayState>({});
  const alertConsumer = React.useContext(AlertContext);
  const timerConsumer = React.useContext(TimerContext);
  const consumerConsumer = React.useContext(ConsumerContext);

  React.useEffect(() => {
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
        <Header>
          <CircleBtn onClick={() => goToHome()} bgColor={"primary"} color={"light"} icon={"icons/cancel.svg"} />
        </Header>
        <SectionContent>
          <SectionWrap>
            <h2>{"Download the Acqua+ App to \n to Create an Account!"}</h2>
            <Webcam>
              <QrSquare><span /></QrSquare>
            </Webcam>
          </SectionWrap>
          <SectionWrap>
            <img id="banner" src={"icons/smartphone_bottle.svg"} />
            <h1>{"Present your code \n to the camera"}</h1>
            <img id="icon" src={"icons/arrow.svg"} />
          </SectionWrap>
        </SectionContent>
      </PrepayContent>
    </section>
  );

};

export default Prepay;