import * as React from "react";
import Menu from "@core/Menu";
import { ConfigContext } from "@containers/config.container";
import { Pages } from "@utils/constants";

interface MenuProps {
  history: any;
  match: any;
}

export const OldMenu = (props: MenuProps) => {
  const configConsumer = React.useContext(ConfigContext);
  const { history } = props;
  const { typeMenu } = props.match.params;
  return (
    <Menu
      onTimeout={() => console.log("Menu => ", "timeout")}
      vendorConfig={configConsumer.vendorConfig}
      menuList={configConsumer.menuList}
      disabledMenuOpen={false}
      typeMenu={`${typeMenu}_menu`}
      onExit={() => history.push(Pages.Home)}
    />
  );
};