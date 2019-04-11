import * as React from "react";
import createContainer from "constate";
import { ConfigContext } from "./config.container";
import { IBeverage } from "@core/models";
import { Beverages } from "@core/utils/constants";

export class ILine {
  line_id: number;
  $beverage: IBeverage;

  constructor({ line_id, $beverage }) {
    this.line_id = line_id;
    this.$beverage = $beverage;
  }
}

export enum AuthLevels {
  Crew = "crew",
  Tech = "tech",
  Super = "super"
}

interface ILines {
  pumps: ILine[];
  waters: ILine[];
}

interface ServiceState {
  test: boolean;
}

const ServiceContainer = createContainer(() => {

  const [authLevel, setAuthLevel] = React.useState<AuthLevels>(null);
  const [lines, setLines] = React.useState<ILines>({
    pumps: [],
    waters: []
  });
  const [syrups, setSyrups] = React.useState<IBeverage[]>([]);

  const [state, setState] = React.useState<ServiceState>({
    test: false
  });

  const configConsumer = React.useContext(ConfigContext);

  React.useEffect(() => {
    console.log("ServiceContainer => Config ;", configConsumer);
    return () => {
      console.log("close");
    };
  }, []);

  /* ==== BEVERAGES / LINES ==== */
  /* ======================================== */

  const { allBeverages, vendorConfig } = configConsumer;
  React.useEffect(() => {
    if (allBeverages && vendorConfig) {
      let pumps = [], waters = [];

      console.log("allBeverages", allBeverages);

      const pumpsNumber = 6; // vendorConfig.installed_pumps_number
      for (let index = 0; index < pumpsNumber; index++) {
        const idLine = index + 1;
        const beverage_ = allBeverages.filter(beverage => beverage.line_id === idLine)[0];
        const line = new ILine({
          line_id: idLine,
          $beverage: beverage_
        });
        pumps.push(line);
      }

      waters = allBeverages
      .filter(beverage => {
        const { beverage_type } = beverage;
        return beverage_type === Beverages.Plain || beverage_type === Beverages.Soda || beverage_type === Beverages.Amb;
      })
      .map(beverage => {
        const line = new ILine({
          line_id: beverage.line_id,
          $beverage: beverage
        });
        return line;
      })
      .sort((a, b) => a.line_id - b.line_id);

      const lines_: ILines = { pumps, waters };
      console.log("setLines", lines_);
      setLines(lines_);

      let syrups_: IBeverage[] = [];
      const notUsed: IBeverage = {
        line_id: null,
        beverage_id: -1,
        beverage_menu_index: -1,
        beverage_type: null,
        beverage_label_id: "not_used"
      };
      const beveragesNotAssigned = allBeverages.filter(beverage => beverage.line_id === -1);
      syrups_ = [notUsed, ...beveragesNotAssigned];
      console.log("setSyrups", syrups_);
      setSyrups(syrups_);
    }
    return () => {

    };
  }, [allBeverages, vendorConfig]);


  const testEvent = () => {
    setState(prevState => ({
      ...prevState,
      test: true
    }));
  };

  return { state, lines, authLevel, setAuthLevel, syrups, testEvent };
});

export const ServiceProvider = ServiceContainer.Provider;
export const ServiceContext = ServiceContainer.Context;