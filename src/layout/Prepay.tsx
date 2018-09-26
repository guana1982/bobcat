import * as React from "react";
import i18n from "../i18n";
import styled from "styled-components";

import { ActionButton } from "../components/global/ActionButton";
import { ConfigConsumer, PaymentConsumer, PaymentInterface, PaymentStore } from "../models";

/* ========= */
// STYLE
/* ========= */

const ScreenContent = styled.div`
  position: absolute;
  width: 600px;
  height: 400px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  color: white;
  text-align: center;
`;

const QrSquare = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  top: 85px;
  width: 230px;
  height: 230px;
  border: 2px solid white;
  z-index: 99;
`;

const Webcam = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 270px;
  height: 270px;
  margin-left: -135px;
  margin-top: -135px;
  background-color: #0000ff;
`;

interface InfoContentProps { textColor?: string; }
const InfoContent = styled<InfoContentProps, "div">("div")`
  text-align: center;
  position: absolute;
  bottom: 80px;
  width: 100%;
  h2 {
    color: ${props => props.textColor || "black"};
  }
  button {
    padding: 10px;
    border: 1px solid gray;
  }
`;

/* ========= */
// COMPONENT
/* ========= */

interface PrepayProps {
  paymentConsumer: PaymentInterface;
  history: any;
}
interface PrepayState {}

export class Prepay extends React.Component<PrepayProps, PrepayState> {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.paymentConsumer.startScanning()
    .subscribe(() => console.log("Start Scanning"));
  }

  componentWillUnmount() {
    this.props.paymentConsumer.stopQrCamera()
    .subscribe(() => console.log("Stop Scanning"));
  }

  render() {
    return (
      <div>
        <div>
          <button onClick={() => this.props.history.push("/home")}>HOME</button>
          <button onClick={() => this.props.history.push("/prepay")}>PREPAY</button>
        </div>
        <ScreenContent>
          <h2>Place your qr-code in front of the camera</h2>
          <QrSquare />
        </ScreenContent>
        <Webcam />
        <InfoContent>
          <h2>{"---"}</h2> { /* machine.data.qr || onClick={onRetry} */ }
          <button>try again</button>
        </InfoContent>
      </div>
    );
  }
}

/* ========= */
// HOC
/* ========= */

export default Prepay;