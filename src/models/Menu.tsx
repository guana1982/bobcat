import * as React from "react";
import { get, post } from "../utils";
import { map, tap, delay } from "rxjs/operators";
import i18n from "../i18n";

export interface MenuInterface {
  // isLit: boolean;
  // onToggleLight: () => void;
}

const MenuContext = React.createContext<MenuInterface | null>(null);

export const MenuProvider = MenuContext.Provider;
export const MenuConsumer = MenuContext.Consumer;

export class MenuStore extends React.Component<any, any> {

  constructor(props) {
    super(props);

    // this.state = {
    //   isLit: false
    // };
  }

  // toggleLight = () => {
  //   this.setState(state => ({ isLit: !state.isLit }));
  // }

  render() {
    const { children } = this.props;
    return (
      <MenuProvider
        value={{
          // isLit: this.state.isLit,
          // onToggleLight: this.toggleLight
        }}
      >
        {children}
      </MenuProvider>
    );
  }
}