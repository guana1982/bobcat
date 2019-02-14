import * as React from "react";
import { observer } from "mobx-react";
import mediumLevel from "../utils/lib/mediumLevel";
import MachineState from "../utils/stores/MachineState";
import { Match } from "../components/Machine";
import Navbar from "../components/Menu/Navbar";
import Auth from "../components/Menu/Auth";
import Gesture from "../components/Menu/Gesture";
import MenuHome from "../components/Menu/MenuHome";
import MenuLauncher from "../components/Menu/MenuLauncher";
import DefaultSubmenu from "../components/Menu/DefaultSubmenu";
import ActionsMosaicSubmenu from "../components/Menu/ActionsMosaicSubmenu";
import WifiManagement from "../components/Menu/Wifi";
import BeverageConfig from "../components/Menu/BeverageConfig";
import BeverageSettings from "../components/Menu/BeverageSettings";
import StockShelfLife from "../components/Menu/StockShelfLife";
import CleanSanitation from "./Custom/CleanSanitation";
import DailyFlush from "../components/Menu/DailyFlush";
import InactivityHandler from "../components/Menu/InactivityHandler";
import Alarms from "../components/Menu/Alarms";

const INACTIVITY_TIMEOUT = 1800; // 30 MINUTES
const IDLE = "idle";
const AUTH = "auth";
const MENU_HOME = "home";
const DEFAULT_SUBMENU = "submenu";
const MOSAIC_SUBMENU = "mosaic";
const CUSTOM_SUBMENU = "custom";
const ERROR = "error";

const actions = {
  "auth.enter": (dispatch, update) => {
    mediumLevel.config.stopVideo();
  },
  "init.enter": async (dispatch, update) => {
    const menus = await mediumLevel.menu.getList().toPromise();
    if (!menus) {
      return dispatch("ERROR");
    }
    update(prevData => ({
      ...prevData,
      menus
    }));
  },
  "submenu.enter": async (dispatch, update, actionPayload, data) => {
    console.log(data);
    const submenu = await mediumLevel.menu.getSubMenu(
      data.menu.menu_id,
      actionPayload ? actionPayload.submenuId : data.submenuId
    ).toPromise();
    if (!submenu || submenu.error) {
      return dispatch("ERROR");
    }
    return dispatch("NEXT", { submenu });
  }
};
const timeoutState = {
  TIMEOUT: {
    [IDLE]: {
      actions: ["reset"]
    }
  }
};
const submenuState = state => ({
  initial: "loading",
  states: {
    loading: {
      on: {
        NEXT: "loaded"
      }
    },
    reloading: {
      on: {
        NEXT: "loaded"
      },
      onEntry: "submenu.enter"
    },
    loaded: {
      on: {
        RELOAD: "reloading"
      }
    }
  },
  on: {
    HOME: MENU_HOME,
    EXIT: IDLE,
    ERROR: ERROR,
    ...timeoutState
  },
  onEntry: "submenu.enter"
});
const statechart = {
  key: "menu",
  initial: "init",
  states: {
    init: {
      on: {
        NEXT: {
          [IDLE]: {
            actions: ["init.enter"]
          }
        },
        ERROR: [ERROR]
      }
    },
    [IDLE]: {
      on: {
        NEXT: [
          {
            target: AUTH,
            cond: ({ menu }) => menu.auth_required === "true"
          },
          {
            target: MENU_HOME,
            cond: ({ menu }) => menu.auth_required === "false"
          }
        ]
      },
      onEntry: "idle.enter"
    },
    [AUTH]: {
      initial: "pin",
      states: {
        pin: {
          on: {
            AUTH_FAIL: "failed"
          }
        },
        failed: {
          on: {
            PIN: "pin"
          }
        }
      },
      on: {
        NEXT: MENU_HOME,
        EXIT: IDLE,
        ...timeoutState
      },
      onEntry: "auth.enter"
    },
    [MENU_HOME]: {
      on: {
        NEXT: [
          {
            target: CUSTOM_SUBMENU,
            cond: ({ submenuId }) => {
              return (
                submenuId === "beverage_settings" ||
                submenuId === "beverage_settings_crew" ||
                submenuId === "beverage_settings_tech" ||
                submenuId === "wifi_management" ||
                submenuId === "clean_sanitation" ||
                submenuId === "beverage_config" ||
                submenuId === "stock_shelf_life" ||
                submenuId === "daily_flush" ||
                submenuId === "alarms_menu_crew" ||
                submenuId === "alarms_menu_tech"
              );
            }
          },
          {
            target: MOSAIC_SUBMENU,
            cond: data => {
              return (
                data.submenuId === "upload_download" ||
                data.submenuId === "download_sales_data"
              );
            }
          },
          {
            target: DEFAULT_SUBMENU
          }
        ],
        EXIT: IDLE,
        ...timeoutState
      }
    },
    [DEFAULT_SUBMENU]: submenuState(DEFAULT_SUBMENU),
    [MOSAIC_SUBMENU]: submenuState(MOSAIC_SUBMENU),
    [CUSTOM_SUBMENU]: {
      on: {
        HOME: MENU_HOME,
        EXIT: IDLE
      }
    },
    [ERROR]: {
      on: {
        HOME: MENU_HOME
      }
    }
  }
};
// can be combination of title/events or just title
// used by <Navbar />
const BREADCRUMBS: any = {
  [`${AUTH}.pin`]: [{ title: "auth" }],
  [`${AUTH}.failed`]: [{ title: "auth" }],
  [MENU_HOME]: (currentState, data) => [{ title: data.menu.label_id }],
  [`${DEFAULT_SUBMENU}.loading`]: (currentState, data) => [
    { title: data.menu.label_id, event: "HOME" },
    { title: "loading_submenu" }
  ],
  [`${DEFAULT_SUBMENU}.loaded`]: (currentState, data) => [
    { title: data.menu.label_id, event: "HOME" },
    { title: data.submenu.id }
  ],
  [`${MOSAIC_SUBMENU}.loading`]: (currentState, data) => [
    { title: data.menu.label_id, event: "HOME" },
    { title: "loading_submenu" }
  ],
  [`${MOSAIC_SUBMENU}.loaded`]: (currentState, data) => [
    { title: data.menu.label_id, event: "HOME" },
    { title: data.submenuId }
  ],
  [CUSTOM_SUBMENU]: (currentState, data) => [
    { title: data.menu.label_id, event: "HOME" },
    { title: data.submenuId }
  ],
  [ERROR]: (currentState, data) => [
    { title: data.menu.label_id, event: "HOME" },
    { title: data.submenuId }
  ]
};
const getBreadcrumbs = (currentState, data) => {
  if (typeof BREADCRUMBS[currentState] === "function") {
    return BREADCRUMBS[currentState](currentState, data);
  }
  return BREADCRUMBS[currentState];
};
type MenuState = {
  canExit: boolean
};
@observer
class Menu extends React.Component<any, MenuState> {

  stateMachine: MachineState;

  constructor(props) {
    super(props);
    this.stateMachine = new MachineState(statechart, actions, {}, true, {
      menu: {},
      submenu: {}
    });
    console.log("PROPS_MENU:", this.props.typeMenu);
    this.state = {
      canExit: true
    };
  }

  componentDidMount() {
    this.onSelect(this.props.typeMenu);
  }

  onGesture = gestureType => {
    const requestedMenu = this.props.menuList.find(m => { // stateMachine.data.menus
      return m.gesture === `gesture_type_${gestureType.toUpperCase()}`;
    });
    this.stateMachine.transition("NEXT", {
      menu: requestedMenu
    });
  }
  onAuthError = () => {
    this.stateMachine.transition("AUTH_FAIL");
    setTimeout(() => {
      this.stateMachine.transition("PIN");
    }, 820);
  }
  onAuthSuccess = () => {
    this.stateMachine.transition("NEXT");
  }
  onExit = () => {
    this.stateMachine.transition("EXIT");
    this.props.onExit();
  }
  onJumpTo = stateEvent => {
    this.stateMachine.transition(stateEvent);
  }
  onEnterSubmenu = submenu => {
    console.log(submenu);
    this.stateMachine.transition("NEXT", { submenuId: submenu.id });
  }
  onBack = () => {
    console.log("here");
    this.stateMachine.transition("HOME");
  }
  onSaved = () => {
    // this.stateMachine.transition("RELOAD")
  }
  onSwitchOffDisplay = () => {
    this.onExit();
    this.props.onSwitchOffDisplay();
  }
  toggleExit = value => {
    this.setState({ canExit: value });
  }
  renderCustomSubmenu = () => {
    const { data, data: { submenuId } } = this.stateMachine;
    const { vendorConfig } = this.props;
    console.log("renderCustom", submenuId);
    switch (submenuId) {
      case "beverage_settings_crew":
        return (
          <BeverageConfig
            menuId={data.menu.menu_id}
            submenuId={submenuId}
            onBack={this.onBack}
          />
        );
      case "beverage_settings_tech":
        return (
          <BeverageSettings
            valvesCount={vendorConfig.installed_valves_number}
            country={vendorConfig.country}
            onBack={this.onBack}
            elementsPerPage={4}
          />
        );
      case "alarms_menu_tech":
        return (
          <Alarms
            menuId={data.menu.menu_id}
            submenuId={submenuId}
            onBack={this.onBack}
            elementsPerPage={8}
          />
        );
      case "wifi_management":
        return <WifiManagement onBack={this.onBack} elementsPerPage={7} />;
      case "stock_shelf_life":
        return <StockShelfLife onBack={this.onBack} elementsPerPage={4} />;
      case "clean_sanitation":
        return (
          <CleanSanitation
            onBack={this.onBack}
            elementsPerPage={10}
            toggleExit={this.toggleExit}
          />
        );
      case "daily_flush":
        return (
          <DailyFlush
            menuId={data.menu.menu_id}
            submenuId={submenuId}
            onBack={this.onBack}
          />
        );
      default:
        return <div>custom submenu</div>;
    }
  }
  onTimeout = () => {
    console.log("timeout");
    // this.stateMachine.transition("EXIT")
  }
  onSelect = menuType => {
    const requestedMenu = this.props.menuList.find(m => { // stateMachine.data.menus
      return m.menu_id === menuType;
    });
    console.log("requestedMenu", requestedMenu);
    this.stateMachine.transition("NEXT", {
      menu: requestedMenu
    });
  }
  render() {
    const { data } = this.stateMachine;
    const { canExit } = this.state;
    console.log("[MENU]", this.stateMachine.toString());
    console.log("[MENU] data %o", this.stateMachine.data);
    const breadcrumbs = getBreadcrumbs(this.stateMachine.toString(), this.stateMachine.data);
    const { globalMachineState, disabledMenuOpen } = this.props;
    console.log("data.submenu", data);
    console.log(data);
    return (
      <div>
        <Match
          state={this.stateMachine.toString()}
          show={[
            `${AUTH}.*`,
            MENU_HOME,
            `${DEFAULT_SUBMENU}.*`,
            `${MOSAIC_SUBMENU}.*`,
            CUSTOM_SUBMENU,
            ERROR
          ]}
        >
          <div
            style={{
              position: "absolute",
              top: "30px",
              height: "calc(100% - 30px",
              left: 0,
              width: "100%",
              background: "#fff",
              zIndex: 2000
            }}
          >
            <Navbar
              onJumpTo={this.onJumpTo}
              breadcrumbs={breadcrumbs}
              onExit={canExit ? this.onExit : null}
              canExit={canExit}
            />
            <div
              style={{
                position: "absolute",
                top: 80,
                bottom: 0,
                left: 0,
                right: 0
              }}
            >
              <Match state={this.stateMachine.toString()} show={`${AUTH}.*`}>
                <Auth
                  menuId={data.menu.menu_id}
                  onError={this.onAuthError}
                  onSuccess={this.onAuthSuccess}
                  failed={this.stateMachine.toString() === "auth.failed"}
                />
              </Match>
              <Match state={this.stateMachine.toString()} show={MENU_HOME}>
                <MenuHome
                  onTimeout={this.onTimeout}
                  onEnterSubmenu={this.onEnterSubmenu}
                  menu={data.menu}
                />
              </Match>
              <Match state={this.stateMachine.toString()} show={[`${DEFAULT_SUBMENU}.loaded`, `${DEFAULT_SUBMENU}.reloading`]}>
                <DefaultSubmenu
                  menuId={data.menu.menu_id}
                  submenuId={data.submenu.id}
                  submenu={data.submenu}
                  onBack={this.onBack}
                  onSaved={this.onSaved}
                  elementsPerPage={10}
                />
              </Match>
              <Match state={this.stateMachine.toString()} show={`${MOSAIC_SUBMENU}.loaded`}>
                <ActionsMosaicSubmenu
                  menuId={data.menu.menu_id}
                  submenuId={data.submenu.id}
                  submenu={data.submenu}
                  onBack={this.onBack}
                />
              </Match>
              <Match state={this.stateMachine.toString()} show={`${CUSTOM_SUBMENU}`}>
                {this.renderCustomSubmenu()}
              </Match>
              <Match state={this.stateMachine.toString()} show={ERROR}>
                <h2>Menu not implemented yet</h2>
              </Match>
            </div>
          </div>
        </Match>
      </div>
    );
  }
}

export default Menu;
