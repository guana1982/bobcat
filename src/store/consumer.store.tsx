import * as React from "react";
import mediumLevel from "../utils/lib/mediumLevel";
import { mergeMap, first, map, tap, delay } from "rxjs/operators";
import { SOCKET_CONSUMER, Pages } from "../utils/constants";
import { IConsumerModel, IdentificationConsumerTypes, IConsumerBeverage } from "../utils/APIModel";
import { Observable, of, merge } from "rxjs";
import { withConfig } from "./config.store";
import { withRouter } from "react-router-dom";
import { IBeverage } from "../models";
import { BeverageStatus } from "../models/beverage.model";
import { BeverageTypes } from "../components/global/Beverage";
import { __ } from "../utils/lib/i18n";

export interface ConsumerInterface {
  isLogged: boolean;
  dataConsumer: IConsumerModel;
  consumerBeverages: IConsumerBeverage[];
  resetConsumer: () => void;
  startScanning: () => Observable<boolean>;
  stopScanning: () => Observable<any>;
  updateConsumerBeverages: () => void;
}

const ConsumerContext = React.createContext<ConsumerInterface | null>(null);

export const ConsumerProvider = ConsumerContext.Provider;
export const ConsumerConsumer = ConsumerContext.Consumer;

class ConsumerStoreComponent extends React.Component<any, any> {

  readonly infoBeverages: any = [{
    flavorTitle: "Favorite 1"
  }, {
    flavorTitle: "Last Pour"
  }, {
    flavorTitle: "Favorite 2"
  }];

  constructor(props) {
    super(props);
    this.state = {
      isLogged: false,
      dataConsumer: null,
      consumerBeverages: []
    };
  }

  resetConsumer = () => {
    this.setState({
      isLogged: false,
      dataConsumer: null,
      consumerBeverages: []
    });
    this.props.history.push(Pages.Attractor);
  }

  private compareConsumerBeverage = (consumerBeverages: IConsumerBeverage[]): IConsumerBeverage[] => {
    const { beverages } = this.props.configConsumer;
    return consumerBeverages.map((consumerBeverage, index) => {
      if (consumerBeverage && consumerBeverage.flavors && consumerBeverage.flavors.length > 0) {
        let beverageFlavor: IBeverage = beverages.filter((b) => Number(b.beverage_id) === Number(consumerBeverage.flavors[0].product.flavorUpc))[0];

        if (!beverageFlavor)
          beverageFlavor = { beverage_label_id: __("Not Available"), status_id: BeverageStatus.EmptyBib };

        consumerBeverage.$type = null;
        if (consumerBeverage.flavorTitle === undefined || consumerBeverage.flavorTitle === null || consumerBeverage.flavorTitle === "") {
          consumerBeverage.flavorTitle = beverageFlavor.beverage_label_id;
        }
        consumerBeverage.$status_id = beverageFlavor.status_id;
        return consumerBeverage;
      } else {
        const infoBeverage = this.infoBeverages[index];
        infoBeverage.$type = BeverageTypes.Info;
        return infoBeverage;
      }
    });
  }

  getConsumerBeverages = (dataConsumer: IConsumerModel): IConsumerBeverage[] => {
    if (!dataConsumer.consumer_id)
      return [];

    let consumerBeverages: IConsumerBeverage[] = [dataConsumer.favorites[0], dataConsumer.last_pour, dataConsumer.favorites[1]];

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
      map((data: any) => data.value)
    );
    return socketConsumer$;
  }

  /* ==== SCANNING ==== */
  /* ======================================== */

  startScanning = (): Observable<boolean> => {

    const loadDataFromQr: Observable<true | false> =
      mediumLevel.config.startQrCamera()
      .pipe(
        mergeMap(() => this.getDataFromSocket(SOCKET_CONSUMER.QR)),
        tap(() => this.stopScanning().subscribe()),
        map((data: IConsumerModel) => {
          console.log(data);
          const isLogged = data.identification_type !== IdentificationConsumerTypes.NoAuth;
          this.setState({
            isLogged: isLogged,
            dataConsumer: data,
            consumerBeverages: this.getConsumerBeverages(data)
          });
          return isLogged;
        }),
      );

    const loadDataFromServer: Observable<null> =
      this.getDataFromSocket(SOCKET_CONSUMER.SERVER)
      .pipe(
        map((data: IConsumerModel) => {
          this.setState({
            dataConsumer: data,
            consumerBeverages: this.getConsumerBeverages(data)
          });
          return null;
        }),
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