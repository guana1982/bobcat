import * as React from "react";

import { QrSquare, Webcam, PrepayContent, Header, SectionWrap, SectionContent } from "./prepay.style";
import { CircleBtn } from "../../components/global/CircleBtn";
import { TimerContext } from "../../store/timer.store";

import { Alert, AlertTypes, AlertProps } from "../../components/global/Alert";
import { ConsumerContext } from "../../store/consumer.store";
import { Pages } from "../../utils/constants";
import { FocusElm } from "../../store/accessibility.store";
import { ConfigContext } from "../../store/config.store";

interface PrepayProps {
  history: any;
}

interface PrepayState {
  alert: AlertProps;
}

export const Prepay = (props: PrepayProps) => {

  const [state, setState] = React.useState<PrepayState>({
    alert: undefined
  });

  const configConsumer = React.useContext(ConfigContext);
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

  const handleAlert = (alert?: AlertProps) => {
    setState(prevState => ({
      ...prevState,
      alert: alert
    }));
  };

  const start = () => {
    const { startScanning } = consumerConsumer;
    startScanning()
    .subscribe((status: true | false | null) => { // => true: correct qr / false: error qr / null: data from server <=
      timerConsumer.clearTimer();
      if (status === true) {
        handleAlert({
          type: AlertTypes.Success,
          timeout: true,
          onDismiss: () => {
            goToHome();
          }
        });
      } else if (status === false) {
        handleAlert({
          type: AlertTypes.Error,
          timeout: true,
          onDismiss: () => {
            start();
            handleAlert();
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

  const { alert } = state;

  return (
    <section data-focus={FocusElm.Controller}>
      <PrepayContent>
        <Header>
          <CircleBtn dataBtnFocus={FocusElm.Init} onClick={() => goToHome()} bgColor={"primary"} color={"light"} icon={"icons/cancel.svg"} />
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
        {alert && <Alert {...alert} />}
      </PrepayContent>
    </section>
  );

};

export default Prepay;