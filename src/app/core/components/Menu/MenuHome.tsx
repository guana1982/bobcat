import * as React from "react";
import { __ } from "@utils/lib/i18n";
import * as styles from "../../Menu/MenuIndex.scss";

const MenuHome = ({ menu, menu: { sub_menus: data }, onEnterSubmenu, onTimeout}) => {
  const enterSubmenu = submenu => e => {
    onEnterSubmenu(submenu);
  };
  return (
    <React.Fragment>
      <div className={styles.mosaic}>
        {data &&
          data.map((submenu, i) => {
            return (
              <div
                className={styles.item}
                onClick={enterSubmenu(submenu)}
                key={i}
              >
                <label>{__(submenu.label_id)}</label>
              </div>
            );
          })}
      </div>
    </React.Fragment>
  );
};
export default MenuHome;
