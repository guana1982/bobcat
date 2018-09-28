import {
  // withHandlers,
  compose,
  lifecycle,
  withState,
  setDisplayName,
  withHandlers
} from "recompose";
import query from "../enhancers/fetchState";
import mediumLevel from "../lib/mediumLevel";

const REFRESH_TIMER = 10000;
let refreshTimer;
const sortAp = accessPoints => {
  return accessPoints
    .sort(
      (a, b) => Math.abs(Number(a.power.replace("dBm", ""))) - Math.abs(Number(b.power.replace("dBm", "")))
    )
    .sort((a, b) => b.favorited - a.favorited)
    .sort((a, b) => b.status - a.status);
};

export default compose(
  setDisplayName("WifiManager"),
  withState("status", "setStatus", undefined),
  withState("accessPoints", "setAccessPoints", []),
  withState("selected", "setSelected", null),
  withState("showInfoMask", "setShowInfo", false),
  withState("showPasswordMask", "setShowPassword", false),
  withState("password", "setPassword", null),
  query(mediumLevel.wifi.scan, {
    name: "scan"
  }),
  query(mediumLevel.wifi.enable, {
    name: "enable"
  }),
  query(mediumLevel.wifi.disable, {
    name: "disable"
  }),
  query(mediumLevel.wifi.getApList, {
    name: "getAccessPoints"
  }),
  query(mediumLevel.wifi.connect, {
    name: "connect"
  }),
  query(mediumLevel.wifi.disconnect, {
    name: "disconnect"
  }),
  withHandlers({
    onPasswordChange: ({ setPassword }) => value => {
      setPassword(value);
    },
    select: ({ setSelected }) => bssid => event => {
      setSelected(current => (current === bssid ? null : bssid));
    },
    toggleInfoMask: ({ setShowInfo }) => () => {
      setShowInfo(current => !current);
    },
    togglePasswordMask: ({ setShowPassword }) => () => {
      setShowPassword(current => !current);
    },
    enableWifi: ({ getAccessPoints, setStatus, enable, setAccessPoints }) => async () => {
      const enabled = await enable();
      if (enabled.error) {
        console.log("Cannot enable wifi:", enabled);
        return;
      }
      const wifi = await getAccessPoints();
      if (wifi.networks.length) setAccessPoints(sortAp(wifi.networks));
      setStatus(wifi.wifi_enable);
    },
    disableWifi: ({ getAccessPoints, setStatus, disable, setAccessPoints }) => async () => {
      const disabled = await disable();
      if (disabled.error) {
        console.log("Cannot disable wifi:", disabled);
        return;
      }
      setStatus(false);
    },
    getAccessPointsList: ({ getAccessPoints, setStatus, setAccessPoints }) => async () => {
      const wifi = await getAccessPoints();
      if (wifi.networks.length) setAccessPoints(sortAp(wifi.networks));
      setStatus(wifi.wifi_enable);
    },
    connectAp: ({ accessPoints, getAccessPoints, setAccessPoints, connect }) => async (bssid, password) => {
      const ap = accessPoints.find(a => a.bssid === bssid);
      ap.status = 2;
      setAccessPoints(sortAp(accessPoints));
      const connected = await connect(bssid, password);
      if (!connected || connected.error) {
        ap.status = 0;
      } else {
        ap.status = 1;
      }
      setAccessPoints(sortAp(accessPoints));
    },
    scanWifi: ({ scan, setAccessPoints }) => async () => {
      const accessPoints = await scan();
      if (accessPoints.length) setAccessPoints(sortAp(accessPoints));
    },
    disconnectAp: ({ accessPoints, getAccessPoints, setAccessPoints, disconnect }) => async bssid => {
      const ap = accessPoints.find(a => a.bssid === bssid);
      const disconnected = await disconnect(bssid);
      if (disconnected && !disconnected.error) {
        ap.status = 0;
        setAccessPoints(sortAp(accessPoints));
      }
    }
  }),
  lifecycle({
    componentDidMount() {
      const { getAccessPointsList } = this.props;
      // const update = () => {
      getAccessPointsList();
      //   refreshTimer = setTimeout(() => {
      //     update()
      //   }, REFRESH_TIMER)
      // }
      // update()
    },
    componentWillUnmount() {
      clearTimeout(refreshTimer);
    }
  })
);
