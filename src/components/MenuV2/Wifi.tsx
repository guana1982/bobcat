import * as React from "react";
import { compose, withProps, setDisplayName } from "recompose";
import { __ } from "../../lib/i18n";
import Card from "../common/Card";
import InputWithKeyboard from "../common/InputWithKeyboard";
import ErrorDialog from "../common/ErrorDialog";
import withWifiManager from "../../enhancers/wifi";
import withPaginatedElements from "../common/paginatedElements";
import withClickOutside from "../common/clickOutside";
import withBlink from "../common/withBlink";
import * as styles from "../../VendorComponents/Menu/Custom/Wifi.scss";

const STATUS_LABELS = {
  0: "wifi_not_connected",
  1: "wifi_connected",
  2: "wifi_connecting",
  3: "wifi_error"
};

const LoadingIcon = withBlink(({ width = 164, height = 164, blinkingIndex }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 509.44 509.44">
      <g>
      	<g>
      		<circle cx="256" cy="414.663" r="42.667"/>
      	</g>
      </g>
      <g>
      	<g>
      		<path
            fill={blinkingIndex === 0 ? "inherit" : "#ddd"}
            d="M191.602,281.305c-11.385,6.145-21.815,13.915-30.962,23.065h0.213c-9.143,9.136-16.905,19.557-23.04,30.933L166.4,363.89
c19.098-48.955,74.266-73.158,123.221-54.059c24.785,9.669,44.39,29.274,54.059,54.059l28.587-28.587
      			C337.289,270.503,256.402,246.327,191.602,281.305z"/>
      	</g>
      </g>
      <g>
      	<g>
      		<path
            fill={blinkingIndex === 1 ? "inherit" : "#ddd"}
            d="M124.864,199.307c-11.255,7.885-21.773,16.773-31.424,26.556c-8.989,9.108-17.195,18.956-24.533,29.44l27.307,27.093
      			c58.135-87.835,176.468-111.912,264.304-53.777c21.354,14.133,39.643,32.423,53.776,53.777L441.6,255.09
      			C369.54,152.221,227.732,127.246,124.864,199.307z"/>
      	</g>
      </g>
      <g>
      	<g>
      		<path
            fill={blinkingIndex === 2 ? "inherit" : "#ddd"}
            d="M57.31,120.23c-11.018,8.568-21.467,17.843-31.283,27.766c-9.242,9.073-17.933,18.69-26.027,28.8l27.307,27.307
      			c93.852-125.635,271.781-151.401,397.416-57.549c11.6,8.665,22.519,18.205,32.664,28.535c8.959,9.102,17.298,18.795,24.96,29.013
      			l27.307-27.307C400.362,36.265,197.841,10.939,57.31,120.23z"/>
      	</g>
    </g>
    </svg>
  );
});
const WifiDisabledIcon = ({ width = 164, height = 164 }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 509.44 509.44">
      <g>
        <g>
          <circle cx="256" cy="431.649" r="42.667" fill="#c2c2c2" />
        </g>
      </g>
      <g>
        <g>
          <path
            d="M111.573,103.969c-31.587,15.539-60.414,36.15-85.333,61.013c-9.315,9.067-18.077,18.684-26.24,28.8l27.307,27.307    c7.868-10.239,16.421-19.932,25.6-29.013c25.142-24.97,54.736-45.012,87.253-59.093L111.573,103.969z"
            fill="#c2c2c2"
          />
        </g>
      </g>
      <g>
        <g>
          <path d="M192,184.822c-50.004,13.969-93.595,44.89-123.307,87.467l27.52,27.093c29.213-44.278,75.635-74.297,128-82.773    L192,184.822z" fill="#c2c2c2" />
        </g>
      </g>
      <g>
        <g>
          <path d="M296.533,288.929c-61.43-20.099-128.414,6.911-158.72,64l28.587,28.587c19.11-48.95,74.284-73.139,123.234-54.029    c12.267,4.789,23.406,12.072,32.713,21.389C332.16,357.836,296.533,288.929,296.533,288.929z" fill="#c2c2c2" />
        </g>
      </g>
      <g>
        <g>
          <rect x="228.415" y="-77.121" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -106.9645 251.2049)" width="42.667" height="663.683" fill="#c2c2c2" />
        </g>
      </g>
      <g>
        <g>
          <path d="M162.773,84.129l31.36,31.573c108.358-25.086,221.309,16.162,288,105.173l27.307-27.307    C427.836,88.621,289.843,45.057,162.773,84.129z" fill="#c2c2c2" />
        </g>
      </g>
      <g>
        <g>
          <path d="M256,175.649l42.667,43.947c34.699,7.711,66.505,25.093,91.733,50.133c9.082,9.042,17.23,18.977,24.32,29.653    l27.307-27.307C399.8,211.125,330.147,175.02,256,175.649z" fill="#c2c2c2" />
        </g>
      </g>
    </svg>
  );
};
const CheckmarkIcon = ({ width = 20, height = 20, fill = "inherit" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
      <path fill={fill} d="M0 11.522l1.578-1.626 7.734 4.619 13.335-12.526 1.353 1.354-14 18.646z" />
    </svg>
  );
};
const LockIcon = ({ width = 20, height = 20, fill = "inherit" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
      <path fill={fill} d="M6 8v-2c0-3.313 2.686-6 6-6 3.312 0 6 2.687 6 6v2h-2v-2c0-2.206-1.795-4-4-4s-4 1.794-4 4v2h-2zm15 2v14h-18v-14h18zm-2 2h-14v10h14v-10z" />
    </svg>
  );
};
const paginated = compose(
  setDisplayName("PaginatedWifi"),
  withProps({
    elementsPerPage: 7,
    elementsAccessor: ({ accessPoints }) => accessPoints
  }),
  withPaginatedElements()
);
const InfoMask = withClickOutside(({ handleClickOutside, onClickOutside, ap }) => {
  return (
    <div className={styles.infoMask}>
      <div className={styles.modal}>
        <header className={styles.modalHeader}>
          <h3>{ap.bssid}</h3>
          <span className={styles.closeButton}>&times;</span>
        </header>
        <div className={styles.apInfo} {...handleClickOutside()}>
          <div className={styles.infoField}>
            <label>{__("wifi_status")}:</label>
            <label>{__(STATUS_LABELS[ap.status])}</label>
          </div>
          <div className={styles.infoField}>
            <label>{__("ip_v4_address")}:</label>
            <label>{ap.ip}</label>
          </div>
          <div className={styles.infoField}>
            <label>{__("subnet_mask")}:</label>
            <label>{ap.subnet_mask}</label>
          </div>
          <div className={styles.infoField}>
            <label>{__("router")}:</label>
            <label>{ap.router}</label>
          </div>
          <div className={styles.infoField}>
            <label>{__("encryption")}:</label>
            <label>{ap.encryption}</label>
          </div>
        </div>
      </div>
    </div>
  );
});
const SignalIcon = ({ power, active }) => {
  const db = 100 - Math.abs(Number(power.replace("dBm", "")));
  const ratio = Math.round(db / 100 * 5);
  return (
    <label>
      {[...Array(5).keys()].map((d, i) => {
        return (
          <div
            style={{
              display: "inline-block",
              marginRight: 2,
              width: 2,
              height: (i + 1) * 3,
              background: !active ? (i < ratio ? "#555" : "#ddd") : i < ratio ? "#fff" : "#999"
            }}
            key={i}
          />
        );
      })}
    </label>
  );
};
const PaginatedAp = paginated(({ accessPoints = [], select, selected, selectedAp, page, totalPages, nextPage, prevPage, elementsPerPage }) => {
  const start = (page - 1) * elementsPerPage;
  const end = start + elementsPerPage;
  return (
    <div className={styles.list}>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.pages}>
            <label>{__("page")}</label>
            <label>
              {page} / {totalPages}
            </label>
          </div>
          <button onClick={nextPage}>
            ↓
          </button>
          <button onClick={prevPage}>
            ↑
          </button>
        </div>
      )}
      {accessPoints.slice(start, end).map((ap, i) => {
        const actualIndex = i + elementsPerPage * (page - 1);
        return (
          <div key={actualIndex} onClick={select(ap.bssid)} className={[styles.ap, styles["status" + ap.status], ap.bssid === selected && styles.selected].join(" ")}>
            <label className={styles.bssid}>
              <strong className={styles.checkmark}>{ap.status === 1 ? <CheckmarkIcon fill={ap.bssid === selected ? "#fff" : "inherit"} /> : " "}</strong> {ap.bssid}
            </label>
            {ap.status > 0 && ap.status !== 1 && <label className={styles.status}>{__(STATUS_LABELS[ap.status])}</label>}
            <label className={styles.encryption}>{ap.locked ? <LockIcon fill={ap.bssid === selected ? "#fff" : "inherit"} /> : " "}</label>
            <div>
              <SignalIcon active={selected === ap.bssid} power={ap.power} />
            </div>
          </div>
        );
      })}
    </div>
  );
});
const WifiManager = withWifiManager(
  ({
    getAccessPointsList,
    accessPoints = [],
    enableWifi,
    disableWifi,
    disableState: { loading: isDisabling },
    enableState: { loading: isEnabling, error: cannotEnable },
    getAccessPointsState: { loading, error },
    connectState: { loading: connecting, error: connectionError },
    disconnectState: { loading: disconnecting, error: disconnectionError },
    selected,
    select,
    togglePasswordMask,
    showPasswordMask,
    connectAp,
    disconnectAp,
    onPasswordChange,
    password,
    showInfoMask,
    toggleInfoMask,
    onBack,
    status
  }) => {
    if (error) {
      return <div>{error}</div>;
    }
    const selectedAp = accessPoints.find(ap => ap.bssid === selected) || {};
    const onDisconnect = () => {
      disconnectAp(selected);
    };
    const onConnect = () => {
      // if (!selectedAp.locked) {
      //   return connectAp(selectedAp.bssid, password)
      // }
      togglePasswordMask();
    };
    const onConfirmPassword = () => {
      if (password) {
        connectAp(selectedAp.bssid, password);
      }
      togglePasswordMask();
    };
    const loadingIcon = (
      <LoadingIcon
        items={[0, 1, 2]}
        itemsAccessor={props => props.items}
        shouldBlink={true}
      />
    );
    if (status === undefined || isEnabling) {
      return (
        <div className={styles.wifiDisabled}>
          <div>{loadingIcon}</div>
        </div>
      );
    }
    if (status === false && !isEnabling && !isDisabling) {
      return (
        <div className={styles.wifiDisabled}>
          <h2>{__("wifi_management")}</h2>
          <div>{isEnabling ? loadingIcon : <WifiDisabledIcon />}</div>
          <p>
            <button className={styles.wifiEnable} onClick={enableWifi} disabled={isEnabling}>
              {isEnabling ? __("wifi_enabling") : __("wifi_enable")}
            </button>
          </p>
        </div>
      );
    }
    return (
      <div className={styles.wifi}>
        {connectionError && <ErrorDialog message={connectionError} />}
        {showPasswordMask && <InputWithKeyboard title={__("enter_password")} initialShow={showPasswordMask} onToggle={onConfirmPassword} onChange={onPasswordChange} theme={styles} />}
        {showInfoMask && <InfoMask onClickOutside={toggleInfoMask} ap={selectedAp} />}
        <Card title={__("wifi_management")}>
          <div className={styles.pane}>
            <div className={styles.scroller}>
              <div>
                <label>
                  {__("wifi")}: {loading ? __("scanning_wifi") : __("on")}
                </label>
              </div>
              <PaginatedAp accessPoints={accessPoints} select={select} selected={selected} selectedAp={selectedAp} />
            </div>
          </div>
        </Card>
        <div className={"menu-button-bar"}>
          <button className={"button-bar__button"} onClick={onBack}>
            {__("back")}
          </button>
          <button className={"button-bar__button button-bar__button--light"} disabled={!selectedAp.bssid} onClick={toggleInfoMask}>
            {__("wifi_info")}
          </button>
          <button className={"button-bar__button button-bar__button--light"} disabled={!selectedAp.bssid || disconnecting} onClick={selectedAp.status > 0 ? onDisconnect : onConnect}>
            {__(selectedAp.status > 0 ? "wifi_disconnect" : "wifi_connect")}
          </button>
          <button disabled={loading} className={"button-bar__button"} onClick={getAccessPointsList}>
            {__("wifi_scan")}
          </button>
        </div>
        <div style={{ textAlign: "center" }}>
          <button onClick={disableWifi} className={styles.wifiEnable}>
            {__("disable_wifi")}
          </button>
        </div>
      </div>
    );
  }
);
export default WifiManager;