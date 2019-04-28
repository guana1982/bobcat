import * as React from "react";
import { Modal, Box, ACTIONS_CLOSE, ACTIONS_CONFIRM, ModalContentProps, ModalTheme } from "@modules/service/components/common/Modal";
import { MButton, MTypes } from "@modules/service/components/common/Button";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { IWifi, IAccessPoint } from "@core/utils/APIModel";
import styled, { keyframes } from "styled-components";
import { Subscription } from "rxjs";
import { __ } from "@core/utils/lib/i18n";
import { SignalIcon, CheckmarkIcon, LockIcon, WifiDisabledIcon, LoadingIcon } from "../common/Icons";
import { tap, flatMap } from "rxjs/operators";
import { ModalKeyboard, ModalKeyboardTypes } from "../common/ModalKeyboard";
import { ServiceProvider, ServiceContext } from "@core/containers";

/* ==== SECTIONS ==== */
/* ======================================== */

const WifiContent = styled.div`
  .list {
    max-height: 280px;
    width: 550px;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    -webkit-transform: translate3d(0, 0, 0);
    border: 2px solid ${props => props.theme.dark};
    margin-bottom: 1rem;
    .item {
      background: ${props => props.theme.light};
      display: flex;
      padding: 5px 10px;
      height: 50px;
      align-items: center;
      justify-content: space-between;
      &:not(:last-child) {
        border-bottom: 2px solid ${props => props.theme.dark};
      }
      #bssid {
        width: 300px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      &.selected {
        background: ${props => props.theme.dark};
        #bssid {
          color: ${props => props.theme.light};
        }
        svg {
          fill: ${props => props.theme.light};
        }
      }
    }
  }
  .icon-content {
    width: 550px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Wifi = (props) => {
  const { accessPoints, setApList, wifiEnable } = props;

  const [modalInfo, setModalInfo] = React.useState<boolean>(false);
  const [accessPointSelected, setAccessPointSelected] = React.useState<IAccessPoint>(null);

  const disconnect = () => {
    mediumLevel.wifi.disconnect()
    .pipe(
      flatMap(() => setApList)
    )
    .subscribe();
  };

  const connect = () => {
    const { bssid } = accessPointSelected;
    const password = "12345"; // TO IMPLEMENT => MODAL KEYBOARD
    mediumLevel.wifi.connect(bssid , password)
    .pipe(
      flatMap(() => setApList)
    )
    .subscribe();
  };

  if (wifiEnable === null)
  return (
    <WifiContent>
      <h1>Wifi</h1>
      <div className="icon-content">
        <LoadingIcon items={[0, 1, 2]} itemsAccessor={props => props.items} shouldBlink={true} />
      </div>
    </WifiContent>
  );

  if (wifiEnable === false)
  return (
    <WifiContent>
      <h1>Wifi</h1>
      <div className="icon-content">
        <WifiDisabledIcon />
      </div>
    </WifiContent>
  );

  if (wifiEnable === true)
  return (
    <>
      <WifiContent>
        <h1>Wifi</h1>
        <div className="list">
          {accessPoints.map((ap, index) => {
            const selected = ap === accessPointSelected;
            return (
              <div key={index} className={`item ${selected && "selected"}`} onClick={() => setAccessPointSelected(ap)}>
                <div>
                  {ap.status === 1 && <CheckmarkIcon />}
                  <span id="bssid"> {ap.bssid}</span>
                </div>
                <div>
                  {ap.locked && <LockIcon />}{" "}
                  <SignalIcon active={selected} power={ap.power} />
                </div>
              </div>
            );
          })}
        </div>
        <Box className="centered">
          <MButton
            className="tiny"
            onClick={() => setApList().subscribe()}
          >
            SCAN
          </MButton>
          <MButton
            className="tiny"
            disabled={!accessPointSelected}
            onClick={() => setModalInfo(true)}
          >
            WIFI INFO
          </MButton>
          {
            accessPointSelected && accessPointSelected.status === 1 ?
              <MButton
                className="tiny"
                onClick={() => disconnect()}
              >
                WIFI DISCONNECT
              </MButton> :
              <MButton
                disabled={!accessPointSelected}
                className="tiny"
                onClick={() => connect()}
              >
                WIFI CONNECTION
              </MButton>
          }
        </Box>
      </WifiContent>
      <Modal
        themeMode={ModalTheme.Dark}
        show={modalInfo}
        cancel={() => setModalInfo(false)}
        title={__("About")}
        actions={ACTIONS_CLOSE}
      >
        <>
          <div>
            <h3>ciao</h3>
          </div>
        </>
      </Modal>
      {/* <ModalKeyboard title={"ENTER PASSWORD"} type={ModalKeyboardTypes.Full} cancel={() => console.log("cancel")} finish={() => console.log("finish")} /> */}
    </>
  );
};

const MobileData = (props) => {
  const { apn, status, ip, signalStrength } = props;
  // console.log("MobileData => props", props);
  return (
    <div>
      <h1>MobileData</h1>
      <h3>STATUS: {status}</h3>
      <h3>APN: {apn}</h3>
      {ip && <h3>IP: {ip}</h3>}
      <h3>SIGNAL STRENGTH: {signalStrength} dbm <SignalIcon power={signalStrength} /></h3>
    </div>
  );
};

const Ethernet = (props) => {
  const { ip, status } = props;
  // console.log("Ethernet => props", props);
  return (
    <div>
      <h1>Ethernet</h1>
      <h3>STATUS: {status}</h3>
      {ip && <h3>IP: {ip}</h3>}
    </div>
  );
};

/* ==== CONNECTIVITY ==== */
/* ======================================== */

const ConnectivityContent = styled.div`
  margin: auto;
`;

enum ConnectionTypes {
  Ethernet = 0,
  Wifi = 1,
  MobileData = 2
}

interface ConnectivityProps extends Partial<ModalContentProps> {}

interface ConnectivityState {
  connectionList: any;
  connectionSelected: any;
  accessPoints: IAccessPoint[];
  wifiEnable: boolean;
}

let getApList_: Subscription = null;

const ConnectivityComponent = (props: ConnectivityProps) => {

  const { cancel } = props;
  const { connectivity } = React.useContext(ServiceContext);

  const [state, setState] = React.useState<ConnectivityState>({
    connectionList: connectivity.list,
    connectionSelected: ConnectionTypes.Wifi,
    accessPoints: [],
    wifiEnable: null
  });

  React.useEffect(() => {
    getApList_  = setApList().subscribe();
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
    if (accessPoints !== []) {
      setState(prevState => ({
        ...prevState,
        accessPoints: [],
        wifiEnable: null
      }));
    }
    return mediumLevel.wifi.getApList()
    .pipe(
      tap((data: IWifi) => {
        const { networks, wifi_enable } = data;
        const networksSort = networks.sort((a, b) => b.status - a.status);
        setState(prevState => ({
          ...prevState,
          accessPoints: networksSort,
          wifiEnable: wifi_enable // false
        }));
      })
    );
  };

  const { connectionList, connectionSelected, accessPoints, wifiEnable } = state;

  return (
    <ConnectivityContent>
      <Box className="centered">
        {connectionList.map((connection, index) => {
          return (
            <MButton
              className="small"
              key={index}
              info light={connectionSelected !== connection.value}
              type={connection.info}
              onClick={() => handleConnection(connection.value)}
            >
              {connection.label}
            </MButton>
          );
        })}
      </Box>
      {connectionSelected === ConnectionTypes.Wifi && <Wifi {...connectionList[0]} accessPoints={accessPoints} wifiEnable={wifiEnable} setApList={setApList} />}
      {connectionSelected === ConnectionTypes.Ethernet && <Ethernet {...connectionList[1]} {...connectivity} />}
      {connectionSelected === ConnectionTypes.MobileData && <MobileData {...connectionList[2]} {...connectivity} />}
    </ConnectivityContent>
  );
};

export default ConnectivityComponent;
