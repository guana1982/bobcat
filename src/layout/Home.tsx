import * as React from "react";

import { ActionButton } from "../components/global/ActionButton";
import { ConfigConsumer } from "../models";

interface HomeProps {}

interface HomeState {
    date: Date;
}

export class Home extends React.Component<HomeProps, HomeState> {

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
        <h1>Home!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        <ActionButton />
        <ConfigConsumer>
          {({ isLit, onToggleLight }) => (
            <div className={`room ${isLit ? "lit" : "dark"}`}>
              The room is {isLit ? "lit" : "dark"}.
              <br />
              <button onClick={onToggleLight}>Flip</button>
            </div>
          )}
        </ConfigConsumer>
      </div>
    );
  }
}