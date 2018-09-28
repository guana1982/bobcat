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
        <div>
          Menu {typeMenu}
        </div>
        <div>
          {/* <button onClick={() => this.props.history.push(`/menu/${typeMenu}/auth`)}>Auth</button>
          <button onClick={() => this.props.history.push(`/menu/${typeMenu}/launcher`)}>Launcher</button> */}
          <ConfigConsumer>
            {config =>
              <Menu
                onTimeout={() => alert("ok")}
                vendorConfig={config.vendorConfig}
                disabledMenuOpen={false}
                typeMenu={`${typeMenu}_menu`}
              />
            }
          </ConfigConsumer>
          {/* <MenuRouter /> */}
        </div>
      </div>
    );
  }
}

export default MenuComponent;