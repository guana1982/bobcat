import { compose, withProps, lifecycle, withHandlers } from "recompose";
import { observer } from "mobx-react";
import query from "../enhancers/fetchState";
import mediumLevel from "../lib/mediumLevel";
// import appLifecycle from 'stores/AppLifecycle'
export const withMenuToggler = compose(observer, withProps(() => ({})));
export const withAvailableMenus = compose(
  query(mediumLevel.menu.getList, {
    name: "getAvailableMenu"
  }),
  lifecycle({
    componentDidMount() {
      this.props.getAvailableMenu();
    }
  })
);
export const withMenuAuth = compose(
  query(mediumLevel.menu.authorize, {
    name: "authorize"
  })
);
export const withSubMenu = compose(
  query(mediumLevel.menu.getSubMenu, {
    name: "getSubMenu"
  }),
  query(mediumLevel.menu.saveMenuConfig, {
    name: "save"
  }),
  query(mediumLevel.menu.action, {
    name: "__runAction"
  }),
  withHandlers({
    saveValues: ({ menuId, submenuId, getSubMenu, save, onSaved }) => async values => {
      const saved = await save(menuId, submenuId, values);
      onSaved && onSaved(saved);
    },
    runAction: ({ __runAction, menuId, submenuId }) => async actionId => {
      const action = await __runAction(menuId, submenuId, actionId);
      console.log("action results", action);
    }
  }),
  lifecycle({
    componentDidMount() {
      const { menuId, submenuId } = this.props;
      console.log(this.props);
      if (!menuId || !submenuId) {
        throw new Error("You must provide both a menuId and a submenuId");
      }
      this.props.getSubMenu(menuId, submenuId);
    }
  })
);
