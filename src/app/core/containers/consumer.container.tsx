import * as React from "react";
import mediumLevel from "../utils/lib/mediumLevel";
import { mergeMap, first, map, tap, delay, debounceTime, timeout, catchError } from "rxjs/operators";
import { SOCKET_CONSUMER, Pages, Beverages, LEVELS } from "../utils/constants";
import { IConsumerModel, IdentificationConsumerTypes, IConsumerBeverage, IdentificationConsumerStatus } from "../utils/APIModel";
import { Observable, of, merge } from "rxjs";
import { withConfig } from "./config.container";
import { withRouter } from "react-router-dom";
import { IBeverage } from "../models";
import { BeverageStatus } from "../models/beverage.model";
import { BeverageTypes } from "../../modules/consumer/components/beverage/Beverage";
import { __ } from "../utils/lib/i18n";

export interface ConsumerInterface {
  isLogged: boolean;
  dataConsumer: IConsumerModel;
  consumerBeverages: IConsumerBeverage[];
  resetConsumer: (noPushAttractor?: boolean) => void;
  startScanning: () => Observable<IdentificationConsumerStatus>;
  stopScanning: () => Observable<any>;
  updateConsumerBeverages: () => void;
}

export const ConsumerContext = React.createContext<ConsumerInterface | null>(null);

export const ConsumerProvider = ConsumerContext.Provider;
export const ConsumerConsumer = ConsumerContext.Consumer;

class ConsumerStoreComponent extends React.Component<any, any> {

  index_qr;
  readonly infoBeverages: any = [{
    $logo_id: "last_pour",
    $types: [BeverageTypes.Info],
    $beverage: { beverage_font_color: "#000" },
    flavorTitle: __("c_recent_drinks")
  }, {
    $logo_id: "favorite",
    $types: [BeverageTypes.Info],
    $beverage: { beverage_font_color: "#000" },
    flavorTitle: __("c_save_favorite_drinks")
  }, {
    $logo_id: null,
    $types: [BeverageTypes.Info],
    $beverage: { beverage_font_color: "#000" },
    flavorTitle: null
  }];

  constructor(props) {
    super(props);
    this.index_qr = -1;
    this.state = {
      isLogged: false,
      dataConsumer: null,
      consumerBeverages: []
    };
  }

  /* ==== CONSUMER FAVORITE ==== */
  /* ======================================== */

  resetConsumer = (noPushAttractor?: boolean) => {
    this.setState({
      isLogged: false,
      dataConsumer: null,
      consumerBeverages: []
    });
    if (!noPushAttractor) {
      this.props.history.push(Pages.Attractor);
    }
  }

  private compareConsumerBeverage = (consumerBeverages: IConsumerBeverage[]): IConsumerBeverage[] => {
    const { allBeverages } = this.props.configConsumer;
    return consumerBeverages.map((consumerBeverage) => {

        if (consumerBeverage && consumerBeverage.$types[0] === BeverageTypes.Info)
          return consumerBeverage;

        const flavor_id = Number(consumerBeverage.flavors[0].product.flavorUpc);

        let beverageFlavor: IBeverage = allBeverages.filter((b) => Number(b.beverage_id) === flavor_id)[0];

        if (!beverageFlavor)
          beverageFlavor = { beverage_label_id: __("Not Available"), status_id: BeverageStatus.EmptyBib, beverage_logo_id: undefined };

        if (consumerBeverage.flavorTitle === undefined || consumerBeverage.flavorTitle === null || consumerBeverage.flavorTitle === "")
          consumerBeverage.flavorTitle = beverageFlavor.beverage_label_id;

        consumerBeverage.$status_id = beverageFlavor.status_id;
        consumerBeverage.$beverage = beverageFlavor;
        consumerBeverage.$sparkling =  Number(consumerBeverage.carbLvl) !== 0;

        const getLevel = (levelType: string, value: number) => {
          const level: { label: string; value: number; }[] = LEVELS[levelType];
          const index = level.findIndex(l => l.value === value);
          let valuePerc = 33;
          if (index === 1) {
            valuePerc = 66;
          } else if (index === 2) {
            valuePerc = 100;
          }
          return valuePerc;
        };
        consumerBeverage.$levels = {
          flavor_perc: getLevel("flavor", Number(consumerBeverage.flavors[0].flavorStrength)),
          carbonation_perc: consumerBeverage.$sparkling ? getLevel("carbonation", Number(consumerBeverage.carbLvl)) : null,
          temperature_perc: getLevel("temperature", Number(consumerBeverage.coldLvl))
        };
        return consumerBeverage;
    });
  }


  getConsumerBeverages = (dataConsumer: IConsumerModel): IConsumerBeverage[] => {
    if (!dataConsumer.consumer_id)
      return [];

    const { lastPour } = dataConsumer;
    const favorites = [
      dataConsumer.favorites[1],
      dataConsumer.favorites[0],
      dataConsumer.favorites[2]
    ];

    let lastPourSame: boolean = false;
    favorites.forEach(favorite => {
      if (favorite === undefined) return;
        favorite.$types = [BeverageTypes.Favorite];

      if (!lastPour.flavors[0]) return;
      if (favorite.flavors[0].product.flavorUpc === lastPour.flavors[0].product.flavorUpc) {
        lastPourSame = true;
        favorite.$types.push(BeverageTypes.LastPour);
      }
    });

    let consumerBeverages: IConsumerBeverage[] = [];

    const validFavorites = favorites.filter(filter => filter);
    const lengthValidFavorites = validFavorites.length;

    if (lastPourSame) {
      if (lengthValidFavorites === 0) {
        consumerBeverages = this.infoBeverages;
      } else if (lengthValidFavorites === 1) {
        consumerBeverages = [this.infoBeverages[1], favorites[1], this.infoBeverages[2]];
      } else if (lengthValidFavorites === 2) {
        consumerBeverages = [favorites[0], favorites[1], this.infoBeverages[2]];
      } else if (lengthValidFavorites === 3) {
        consumerBeverages = favorites;
      }
    } else {
      const lastPourElement = lastPour && lastPour.flavors && lastPour.flavors[0] ? {...lastPour, $types: [BeverageTypes.LastPour]} : this.infoBeverages[0];

      if (lengthValidFavorites === 0) {
        consumerBeverages = [lastPourElement, this.infoBeverages[1], this.infoBeverages[2]];
      } else if (lengthValidFavorites === 1) {
        consumerBeverages = [lastPourElement, favorites[1], this.infoBeverages[2]];
      } else if (lengthValidFavorites === 2) {
        consumerBeverages = [favorites[0], favorites[1], lastPourElement];
      } else if (lengthValidFavorites === 3) {
        consumerBeverages = favorites;
      }
    }

    console.log("consumerBeverages", consumerBeverages);

    const finalConsumerBeverages = this.compareConsumerBeverage(consumerBeverages);

    return finalConsumerBeverages;
  }

  updateConsumerBeverages = (): void => {
    const { consumerBeverages } = this.state;
    let finalConsumerBeverages = this.compareConsumerBeverage(consumerBeverages);
    this.setState({
      consumerBeverages: finalConsumerBeverages
    });
  }

  /* ==== CONSUMER SOCKET ==== */
  /* ======================================== */

  getDataFromSocket = (type: SOCKET_CONSUMER): Observable<any> => {
    const { ws } = this.props.configConsumer;
    const socketConsumer$ = ws
    .multiplex(
      () => console.info(`Start => ${type}`),
      () => console.info(`End => ${type}`),
      (data) => data && data.message_type === type
    )
    .pipe(
      first(),
      map((data: any) => data.value),
    );

    if (type === SOCKET_CONSUMER.SERVER) {
      this.index_qr = this.index_qr + 1;
    }
    return socketConsumer$;
  }

  /* ==== SCANNING ==== */
  /* ======================================== */

  startScanning = (): Observable<IdentificationConsumerStatus> => {

    const loadDataFromQr: Observable<IdentificationConsumerStatus> =
      mediumLevel.config.startQrCamera()
      .pipe(
        mergeMap(() => this.getDataFromSocket(SOCKET_CONSUMER.QR)),
        tap(() => this.stopScanning().subscribe()),
        map((data: IConsumerModel) => {
          const { identification_type } = data;

          if (identification_type === IdentificationConsumerTypes.Vessel || identification_type === IdentificationConsumerTypes.VesselSticker) {
            return IdentificationConsumerStatus.Loading;
          }
          if (identification_type === IdentificationConsumerTypes.NoAuth) {
            return IdentificationConsumerStatus.ErrorQr;
          }

          this.setState({
            isLogged: true,
            dataConsumer: data,
            consumerBeverages: this.getConsumerBeverages(data)
          });
          return IdentificationConsumerStatus.Complete;
        }),
      );

    const loadDataFromServer: Observable<IdentificationConsumerStatus> =
      this.getDataFromSocket(SOCKET_CONSUMER.SERVER)
      .pipe(
        map((data: IConsumerModel) => {
          if (data === null) {
            return IdentificationConsumerStatus.Null;
          }
          if (data.error) {
            return data.error;
          }
          this.setState({
            isLogged: true,
            dataConsumer: data,
            consumerBeverages: this.getConsumerBeverages(data)
          });
          return IdentificationConsumerStatus.CompleteLoading;
        })
      );

    return merge(loadDataFromQr, loadDataFromServer);
  }


  stopScanning = () => mediumLevel.config.stopQrCamera().pipe(first());

  /* ==== MAIN ==== */
  /* ======================================== */

  render() {
    const { children } = this.props;
    const { isLogged, dataConsumer, consumerBeverages } = this.state;
    return (
      <ConsumerProvider
        value={{
          isLogged: isLogged,
          dataConsumer: dataConsumer,
          consumerBeverages: consumerBeverages,
          startScanning: this.startScanning,
          stopScanning: this.stopScanning,
          resetConsumer: this.resetConsumer,
          updateConsumerBeverages: this.updateConsumerBeverages
        }}
      >
        <React.Fragment>
          {children}
        </React.Fragment>
      </ConsumerProvider>
    );
  }
}

export const withConsumer = Comp => props => (
  <ConsumerConsumer>
    {consumer => <Comp {...props} consumerConsumer={consumer}></Comp> }
  </ConsumerConsumer>
);

export const ConsumerStore = withRouter(withConfig(ConsumerStoreComponent));