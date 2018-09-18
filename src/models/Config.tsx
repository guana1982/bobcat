import * as React from "react";
import { get, post } from "../utils";
import { map, tap } from "rxjs/operators";

interface ConfigInterface {
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

    get("config/beverages")
    .pipe(
      tap(() => console.log("-----")),
      map(data => console.log(data)),
      tap(() => console.log("-----"))
    )
    .subscribe(() => alert("ok"));
  }

  toggleLight = () => {
    this.setState(state => ({ isLit: !state.isLit }));
  }

  render() {
    const { children } = this.props;
    return (
      <ConfigContext.Provider
        value={{
          isLit: this.state.isLit,
          onToggleLight: this.toggleLight
        }}
      >
        {children}
      </ConfigContext.Provider>
    );
  }
}