import * as React from "react";
import { ConfigContext } from "@core/containers";
import { __ } from "@core/utils/lib/i18n";

export const About = () => {

  const configConsumer = React.useContext(ConfigContext);
  const { vendorConfig } = configConsumer;
  const { software_version, imei, country, serial_number_mediaboard, serial_number_powerboard, serial_number_mqtt } = vendorConfig;

  return (
    <>
      <ul>
        <li>{__("s_country")}: <b>{country || "---"}</b></li>
        <li>{__("s_imei")}: <b>{imei || "---"}</b></li>
        <li>{__("s_mqtt_sn")}: <b>{serial_number_mqtt || "---"}</b></li>
        <li>{__("s_mediaboard_sn")}: <b>{serial_number_mediaboard || "---"}</b></li>
        <li>{__("s_powerboard_sn")}: <b>{serial_number_powerboard || "---"}</b></li>
        <li>{__("s_software_version")}: <b>{software_version || "---"}</b></li>
      </ul>
    </>
  );
};