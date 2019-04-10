import * as React from "react";
import { Modal, Box, ACTIONS_CLOSE, ACTIONS_CONFIRM, ModalContentProps } from "@modules/service/components/common/Modal";
import { MButton, MTypes } from "@modules/service/components/common/Button";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { IWifi, INetwork } from "@core/utils/APIModel";
import styled, { keyframes } from "styled-components";
import { Subscription } from "rxjs";
import { __ } from "@core/utils/lib/i18n";

/* ==== SECTIONS ==== */
/* ======================================== */

const WifiContent = styled.div`
  .list {
    max-height: 250px;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    -webkit-transform: translate3d(0, 0, 0);
  }
`;

const Wifi = (props) => {
  const { networks } = props;
  return (
    <WifiContent>
      <h1>Wifi</h1>
      <div className="list">
        {networks.map((network, index) => {
          return (
            <p key={index}>{network.bssid}</p>
          );
        })}
      </div>
    </WifiContent>
  );
};

const MobileData = () => {
  return (
    <div>
      <h1>MobileData</h1>
    </div>
  );
};

const Ethernet = () => (
  <div>
    <h1>Ethernet</h1>
  </div>
);

/* ==== CONNECTIVITY ==== */
/* ======================================== */

enum ConnectionTypes {
  Wifi = 0,
  MobileData = 1,
  Ethernet = 2
}

interface ConnectivityProps extends Partial<ModalContentProps> {}

interface ConnectivityState {
  connectionList: any;
  connectionSelected: any;
  networks: INetwork[];
}

let getApList_: Subscription = null;

const ConnectivityComponent = (props: ConnectivityProps) => {

  const { cancel } = props;

  const [state, setState] = React.useState<ConnectivityState>({
    connectionList: [{
      label: "wifi",
      value: ConnectionTypes.Wifi,
      status: null
    }, {
      label: "mobile_data",
      value: ConnectionTypes.MobileData,
      status: MTypes.INFO_SUCCESS
    }, {
      label: "ethernet",
      value: ConnectionTypes.Ethernet,
      status: MTypes.INFO_WARNING
    }],
    connectionSelected: ConnectionTypes.Wifi,
    networks: []
  });

  React.useEffect(() => {
    getApList_ = null;
    setApList();
    return () => {
      getApList_.unsubscribe();
    };
  }, []);

  const handleConnection = (value) => {
    setState(prevState => ({
      ...prevState,
      connectionSelected: value
    }));
  };

  const setApList = () => {
    getApList_ = mediumLevel.wifi.getApList().subscribe((data: IWifi) => {
      const { networks } = data;
      setState(prevState => ({
        ...prevState,
        networks: networks
      }));
    });
  };

  const { connectionList, connectionSelected, networks } = state;

  return (
    <div>
      <Box>
        {connectionList.map((connection, index) => {
          return (
            <MButton
              className="small"
              key={index}
              info light={connectionSelected !== connection.value}
              type={connection.status}
              onClick={() => handleConnection(connection.value)}
            >
              {connection.label}
            </MButton>
          );
        })}
      </Box>
      {connectionSelected === ConnectionTypes.Wifi && <Wifi networks={networks} />}
      {connectionSelected === ConnectionTypes.MobileData && <MobileData />}
      {connectionSelected === ConnectionTypes.Ethernet && <Ethernet />}
    </div>
  );
};

export default ConnectivityComponent;
