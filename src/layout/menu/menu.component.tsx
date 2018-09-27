import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import MenuRouter from "./menu.router";

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
          <button onClick={() => this.props.history.push(`/menu/${typeMenu}/auth`)}>Auth</button>
          <button onClick={() => this.props.history.push(`/menu/${typeMenu}/launcher`)}>Launcher</button>
          <MenuRouter />
        </div>
      </div>
    );
  }
}

export default MenuComponent;