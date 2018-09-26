import * as React from "react";

interface MenuProps {
  history: any;
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
    return (
      <div>
        <div>
          Menu
        </div>
        <div>
          <button onClick={() => this.props.history.push("/menu/auth")}>Auth</button>
          <button onClick={() => this.props.history.push("/menu/launcher")}>Launcher</button>
        </div>
      </div>
    );
  }
}

export default MenuComponent;