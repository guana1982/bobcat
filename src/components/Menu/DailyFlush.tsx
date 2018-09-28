import * as React from "react";
import { withProps, withHandlers, withState, compose, lifecycle } from "recompose";
import { __ } from "../../utils/lib/i18n";
import { withSubMenu } from "../../utils/enhancers/menu";
import * as styles from "../../Menu/Custom/DailyFlush.scss";

const enhance = compose(
  withSubMenu,
  withState("flushing", "setFlushing", false),
  withHandlers({
    startFlush: ({ setFlushing, runAction, menuId, submenuId }) => async () => {
      const started = await runAction("start_flush");
      console.log("- start flushing", started);
      // if (!startFlush || startFlush.error) {
      //   console.log('! Cannot start flushing', startFlush)
      //   return
      // }
      setFlushing(true);
    },
    stopFlush: ({ getSubMenu, setFlushing, runAction, menuId, submenuId }) => async () => {
      const stopped = await runAction("stop_flush");
      console.log("- stop flushing", stopped);
      // if (!stopFlush || stopFlush.error) {
      //   console.log('! Cannot stop flushing', stopFlush)
      //   return
      // }
      getSubMenu(menuId, submenuId);
      setFlushing(false);
    }
  }),
  lifecycle({
    componentWillUnmount() {
      const { runAction, flushing } = this.props;
      if (flushing) {
        const stopped = runAction("stop_flush");
        console.log("- stopped flush", stopped);
      }
    }
  })
);
const DailyFlush = enhance(
  ({
    onBack,
    runAction,
    getSubMenuState: { data: submenu },
    startFlush,
    stopFlush,
    flushing
  }) => {
    if (!submenu || !submenu.id) {
      return null;
    }
    return (
      <div className={styles.dailyFlush}>
        <button
          className={styles.flushButton}
          onClick={!flushing ? startFlush : stopFlush}
        >
          {!flushing ? __("start") : __("stop")}
        </button>
        <div className={styles.date}>
          <label>{__("flush_minimum_duration")}</label>
          <p>
            {submenu.elements[1].value} {submenu.elements[1].unit}
          </p>
        </div>
        <div className={styles.date}>
          <label>{__("last_flush_date")}</label>
          <p>{submenu.elements[0].value}</p>
        </div>
        <div className={"menu-button-bar"}>
          <button className={"button-bar__button"} onClick={onBack}>
            {__("back")}
          </button>
          <button className={"button-bar__button"} disabled />
        </div>
      </div>
    );
  }
);
export default DailyFlush;
