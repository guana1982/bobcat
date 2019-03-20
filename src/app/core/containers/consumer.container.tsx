import * as React from "react";
import mediumLevel from "../utils/lib/mediumLevel";
import { mergeMap, first, map, tap, delay } from "rxjs/operators";
import { SOCKET_CONSUMER, Pages } from "../utils/constants";
import { IConsumerModel, IdentificationConsumerTypes, IConsumerBeverage } from "../utils/APIModel";
import { Observable, of, merge } from "rxjs";
import { withConfig } from "./config.container";
import { withRouter } from "react-router-dom";
import { IBeverage } from "../models";
import { BeverageStatus } from "../models/beverage.model";
import { BeverageTypes } from "../components/global/Beverage";
import { __ } from "../utils/lib/i18n";
import { TEST_QR_0, TEST_QR_1, TEST_QR_2, TEST_QR_3 } from "../utils/APIMock";

export interface ConsumerInterface {
  isLogged: boolean;
  dataConsumer: IConsumerModel;
  consumerBeverages: IConsumerBeverage[];
  resetConsumer: (noPushAttractor?: boolean) => void;
  startScanning: () => Observable<boolean>;
  stopScanning: () => Observable<any>;
  updateConsumerBeverages: () => void;
}

export const ConsumerContext = React.createContext<ConsumerInterface | null>(null);

export const ConsumerProvider = ConsumerContext.Provider;
export const ConsumerConsumer = ConsumerContext.Consumer;

class ConsumerStoreComponent extends React.Component<any, any> {

  index_qr;
  readonly infoBeverages: any = [{
    $logo_id: "favorite",
    flavorTitle: __("Save your favorite drinks using the app!")
  }, {
    $logo_id: "last-pour",
    flavorTitle: __("After you pour, your most recent drink will appear here!")
  }, {
    $logo_id: null,
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
    if (noPushAttractor!) {
      this.props.history.push(Pages.Attractor);
    }
  }

  private compareConsumerBeverage = (consumerBeverages: IConsumerBeverage[]): IConsumerBeverage[] => {
    const { beverages } = this.props.configConsumer;
    return consumerBeverages.map((consumerBeverage, index) => {
      if (consumerBeverage && consumerBeverage.flavors && consumerBeverage.flavors.length > 0) {
        let beverageFlavor: IBeverage = beverages.filter((b) => Number(b.beverage_id) === Number(consumerBeverage.flavors[0].product.flavorUpc))[0];

        if (!beverageFlavor)
          beverageFlavor = { beverage_label_id: __("Not Available"), status_id: BeverageStatus.EmptyBib, beverage_logo_id: 9 };

        consumerBeverage.$type = null;
        if (consumerBeverage.flavorTitle === undefined || consumerBeverage.flavorTitle === null || consumerBeverage.flavorTitle === "") {
          consumerBeverage.flavorTitle = beverageFlavor.beverage_label_id;
        }
        consumerBeverage.$status_id = beverageFlavor.status_id;
        consumerBeverage.$beverage = beverageFlavor;
        consumerBeverage.$sparkling =  consumerBeverage.carbLvl !== 0;
        consumerBeverage.$type = index === 1 ? BeverageTypes.LastPour : BeverageTypes.Favorite;
        return consumerBeverage;
      } else {
        const infoBeverage = this.infoBeverages[index];
        infoBeverage.$type = BeverageTypes.Info;
        infoBeverage.$beverage = {};
        return infoBeverage;
      }
    });
  }


  getConsumerBeverages = (dataConsumer: IConsumerModel): IConsumerBeverage[] => {
    if (!dataConsumer.consumer_id)
      return [];

    let consumerBeverages: IConsumerBeverage[] = [dataConsumer.favorites[0], dataConsumer.lastPour, dataConsumer.favorites[1]];

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

    // ____ MOCK
    const mock = () => {
      switch (this.index_qr) {
        case 0:
          return TEST_QR_0;
          break;
        case 1:
          return TEST_QR_1;
          break;
        case 2:
          return TEST_QR_2;
          break;
        case 3:
          return TEST_QR_3;
          break;
      }
    };
    if (type === SOCKET_CONSUMER.SERVER) {
      this.index_qr = this.index_qr + 1;
    }
    return socketConsumer$; // of(mock()); // MOCK //
  }

  /* ==== SCANNING ==== */
  /* ======================================== */

  startScanning = (): Observable<boolean> => {

    const loadDataFromQr: Observable<true | false> =
      mediumLevel.config.startQrCamera()
      .pipe(
        mergeMap(() => this.getDataFromSocket(SOCKET_CONSUMER.QR)),
        tap(() => this.stopScanning().subscribe()),
        tap((data: IConsumerModel) => console.log("ConsumerBeverages", this.getConsumerBeverages(data))),
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