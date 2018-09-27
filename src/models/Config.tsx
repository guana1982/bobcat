import * as React from "react";
import { get, post } from "../utils";
import { map, tap, delay } from "rxjs/operators";
import { RouterStore } from "./Router";
import i18n from "../i18n";

export interface ConfigInterface {
  isLit: boolean;
  onToggleLight: () => void;
}

const ConfigContext = React.createContext<ConfigInterface | null>(null);

export const ConfigProvider = ConfigContext.Provider;
export const ConfigConsumer = ConfigContext.Consumer;

export class ConfigStore extends React.Component<any, any> {

  constructor(props) {
    super(props);

    this.state = {
      isLit: false
    };

    // get("config/beverages")
    // .pipe(
    //   tap(() => console.log("-----")),
    //   map(data => console.log(data)),
    //   tap(() => console.log("-----")),
    //   delay(2000)
    // )
    // .subscribe(
    //   () => {
    //     // alert("ok");
    //     i18n.changeLanguage("es");
    //   },
    //   error => console.log(error)
    // );
  }

  toggleLight = () => {
    this.setState(state => ({ isLit: !state.isLit }));
  }

  render() {
    const { children } = this.props;
    return (
      <ConfigProvider
        value={{
          isLit: this.state.isLit,
          onToggleLight: this.toggleLight
        }}
      >
        {children}
      </ConfigProvider>
    );
  }
}