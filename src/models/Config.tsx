import * as React from "react";
import { get, post } from "../utils";
import { map, tap, delay } from "rxjs/operators";
import i18n from "../i18n";
import mediumLevel from "../utils/MediumLevel";
import { forkJoin, of } from "rxjs";
import { setLangDict } from "../utils/lib/i18n";
import { withRouter } from "react-router-dom";
declare var window: any;

export interface ConfigInterface {
  isLit: boolean;
  vendorConfig: any;
  onToggleLight: () => void;
}

const ConfigContext = React.createContext<ConfigInterface | null>(null);

export const ConfigProvider = ConfigContext.Provider;
export const ConfigConsumer = ConfigContext.Consumer;

class ConfigStoreComponent extends React.Component<any, any> {

  vendorConfig: any;
  ws: WebSocket;

  constructor(props) {
    super(props);

    this.state = {
      isLit: false
    };

    this.ws = new window.WebSocket(process.env.NODE_ENV === "production" ? "ws://93.55.118.42:5901" : "ws://192.168.188.204:5901"); // ws://0.0.0.0:5901
    this.ws.onopen = () => {
      console.log("connected");
    };

    this.ws.onmessage = data => {
      console.log("socket message was received", data);
    };

    // setTimeout(() => {
    //   alert("ook");
    //   this.props.history.push("/home");
    // }, 1000);

    forkJoin(
      mediumLevel.config.getVendor(),
      mediumLevel.config.getBeverages(),
      mediumLevel.config.getSizes(),
      mediumLevel.config.getLang(),
      mediumLevel.config.startDisplay(),
    ).subscribe((res: any[]) => {
      console.log({res});
      let [
        vendorConfig,
        beverages,
        sizes,
        langDict
      ] = res;

      this.vendorConfig = vendorConfig;
      setLangDict(langDict.i18n);
    });

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
          onToggleLight: this.toggleLight,
          vendorConfig: this.vendorConfig
        }}
      >
        {children}
      </ConfigProvider>
    );
  }
}

export const ConfigStore = withRouter(ConfigStoreComponent);