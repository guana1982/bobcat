import * as React from "react";
import { Modal, Box, ACTIONS_CLOSE, ACTIONS_CONFIRM } from "@modules/service/components/Modal";
import { MButton, MTypes } from "@modules/service/components/Button";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { IWifi, INetwork } from "@core/utils/APIModel";
import styled, { keyframes } from "styled-components";

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

interface ConnectivityProps {}

interface ConnectivityState {
  connectionList: any;
  connectionSelected: any;
  networks: INetwork[];
}

class ConnectivityComponent extends React.Component<ConnectivityProps, ConnectivityState> {

  readonly state: ConnectivityState;

  constructor(props) {
    super(props);
    this.state = {
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
    };
  }

  componentDidMount() {
    this.setApList();
  }

  componentWillUnmount() {

  }

  handleConnection = (value) => {
    this.setState({connectionSelected: value});
  }

  setApList() {
    mediumLevel.wifi.getApList().subscribe((data: IWifi) => {
      const { networks } = data;
      this.setState({networks: networks});
    });
  }

  render() {
    const { connectionList, connectionSelected, networks } = this.state;
    return (
      <Modal
        title="Connectivity"
        content={
          <div>
            <Box>
              {connectionList.map((connection, index) => {
                return (
                  <MButton
                    className="small"
                    key={index}
                    info light={connectionSelected !== connection.value}
                    type={connection.status}
                    onClick={() => this.handleConnection(connection.value)}
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
        }
        actions={ACTIONS_CONFIRM}
      ></Modal>
    );
  }
}

export default ConnectivityComponent;
