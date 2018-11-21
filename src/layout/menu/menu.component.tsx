import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Menu from "../../Menu";
import { ConfigConsumer, ConfigInterface } from "../../store/config.store";

interface MenuProps {
  history: any;
  configConsumer: ConfigInterface;
  match: any;
}

interface MenuState {
    date: Date;
}

export class MenuComponent extends React.Component<MenuProps, MenuState> {

  readonly state: MenuState;

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
        date: new Date()
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { typeMenu } = this.props.match.params;
    const { configConsumer } = this.props;
    return (
      <Menu
        onTimeout={() => console.log("menu", "timeout")}
        vendorConfig={configConsumer.vendorConfig}
        disabledMenuOpen={false}
        typeMenu={`${typeMenu}_menu`}
        onExit={() => this.props.history.push("/home")}
      />
    );
  }
}

export default MenuComponent;