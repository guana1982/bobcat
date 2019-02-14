import * as React from "react";
import Menu from "../../Menu";
import { ConfigContext } from "../../store/config.store";
import { Pages } from "../../utils/constants";

interface MenuProps {
  history: any;
  match: any;
}

const MenuComponent = (props: MenuProps) => {
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

export default MenuComponent;