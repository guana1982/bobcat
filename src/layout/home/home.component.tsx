import * as React from "react";
import i18n from "../../i18n";

import { ActionButton } from "../../components/global/ActionButton";
import { ConfigConsumer } from "../../models";
import LauncherComponent, { Action } from "../../components/global/Launcher";

interface HomeProps {
  history: any;
}

interface HomeState {
    date: Date;
}

export class Home extends React.Component<HomeProps, HomeState> {

  timerID: any;
  actionsLauncher: Action[];

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
        date: new Date()
    };
    this.actionsLauncher = [
      {
        title: "TEST QR CODE",
        event: () => this.props.history.push("/prepay")
      },
      {
        title: "CREW MENU",
        event: () => this.props.history.push("/menu/crew")
      },
      {
        title: "TECH MENU",
        event: () => this.props.history.push("/menu/tech")
      }
    ];
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
        <h1>{i18n.t("home.label")}</h1>
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
        <LauncherComponent actions={this.actionsLauncher} />
      </div>
    );
  }
}

export default Home;