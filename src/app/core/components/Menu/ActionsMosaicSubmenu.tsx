import * as React from "react";
import { __ } from "@utils/lib/i18n";
import { withSubMenu } from "@utils/enhancers/menu";
import ErrorDialog from "@components/common/ErrorDialog";
import * as styles from "../../Menu/MenuIndex.scss";

const ActionsMosaicSubmenu = withSubMenu(
  ({
    onBack,
    submenu,
    __runActionState: {
      loading: actionRunnning,
      data: actionResults,
      error: actionError
    },
    runAction,
    menuId
  }) => {
    const runActionOnClick = action => e => {
      runAction(action.id);
    };
    if (!submenu) {
      return null;
    }
    return (
      <React.Fragment>
        {submenu.elements &&
          submenu.elements.length > 0 && (
            <div className={styles.menuInfoBar}>
              {submenu.elements.map((d, i) => {
                return (
                  <div key={i}>
                    <label>
                      {__(d.label_id)}: {d.value}
                    </label>
                  </div>
                );
              })}
            </div>
          )}
        <div className={styles.mosaicWithBar}>
          {actionError && <ErrorDialog message={actionError} />}
          {submenu.actions &&
            submenu.actions.map((action, i) => {
              return (
                <button
                  onClick={runActionOnClick(action)}
                  className={styles.item}
                  disabled={actionRunnning}
                  key={i}
                >
                  <label>
                    {__(action.label_id)}
                    <br />
                  </label>
                </button>
              );
            })}
        </div>
        <div className={"menu-button-bar"}>
          <button
            onClick={onBack}
            className={"button-bar__button"}
            disabled={actionRunnning}
          >
            {__("back")}
          </button>
          <button className={"button-bar__button"} />
        </div>
      </React.Fragment>
    );
  }
);
export default ActionsMosaicSubmenu;
