import * as React from "react";
import { ConfigContext } from "@core/containers";

export const About = () => {

  const configConsumer = React.useContext(ConfigContext);
  const { vendorConfig } = configConsumer;
  const { software_version, imei, country, serial_number_mediaboard, serial_number_powerboard, serial_number_mqtt } = vendorConfig;

  return (
    <>
      <ul>
        <li>COUNTRY: <b>{country || "---"}</b></li>
        <li>IMEI: <b>{imei || "---"}</b></li>
        <li>MQTT SERIAL NUMBER: <b>{serial_number_mqtt || "---"}</b></li>
        <li>MEDIABOARD SERIAL NUMBER: <b>{serial_number_mediaboard || "---"}</b></li>
        <li>POWERBOARD SERIAL NUMBER: <b>{serial_number_powerboard || "---"}</b></li>
        <li>SOFTWARE VERSIONE: <b>{software_version || "---"}</b></li>
      </ul>
    </>
  );
};