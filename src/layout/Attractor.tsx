import * as React from "react";
import { ConfigConsumer } from "../models";

interface AttractorProps {}

interface AttractorState {
    date: Date;
}

export class Attractor extends React.Component<AttractorProps, AttractorState> {

  timerID: any;

  constructor(props) {
    super(props);
    this.state = {
        date: new Date()
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Attractor!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        <ConfigConsumer>
          {({ isLit }) => (
            <div>
              The room is {isLit ? "lit" : "dark"}.
            </div>
          )}
        </ConfigConsumer>
      </div>
    );
  }
}

export default Attractor;