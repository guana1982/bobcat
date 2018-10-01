import * as React from "react";
import { get, post } from "../utils";
import { map, tap, delay } from "rxjs/operators";
import i18n from "../i18n";
import mediumLevel from "../utils/MediumLevel";
import { forkJoin } from "rxjs";
import { setLangDict } from "../utils/lib/i18n";

export interface ConfigInterface {
  isLit: boolean;
  vendorConfig: any;
  onToggleLight: () => void;
}

const ConfigContext = React.createContext<ConfigInterface | null>(null);

export const ConfigProvider = ConfigContext.Provider;
export const ConfigConsumer = ConfigContext.Consumer;

export class ConfigStore extends React.Component<any, any> {

  vendorConfig: any;

  constructor(props) {
    super(props);

    this.state = {
      isLit: false
    };

    forkJoin(
      mediumLevel.config.getVendor(),
      mediumLevel.config.getBeverages(),
      mediumLevel.config.getSizes(),
      mediumLevel.config.getLang(),
      mediumLevel.config.startDisplay(),
      mediumLevel.menu.getList()
    ).subscribe((res: any[]) => {

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