import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Menu from "../../Menu";
import { ConfigConsumer } from "../../models/Config";

interface MenuProps {
  history: any;
  match: any;
}

interface MenuState {
    date: Date;
}

export class MenuComponent extends React.Component<MenuProps, MenuState> {

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
    return (
      <div>
          <ConfigConsumer>
            {config =>
              <Menu
                onTimeout={() => console.log("menu", "timeout")}
                vendorConfig={config.vendorConfig}
                disabledMenuOpen={false}
                typeMenu={`${typeMenu}_menu`}
                onExit={() => this.props.history.push("/home")}
              />
            }
          </ConfigConsumer>
      </div>
    );
  }
}

export default MenuComponent;