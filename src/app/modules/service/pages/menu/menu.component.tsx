import * as React from "react";
import { MButton, MTypes } from "@modules/service/components/Button";
import { MenuContent, Grid, Group, SIZE_GROUP_ALARM, SIZE_GROUP_INFO, SIZE_GROUP_LINES, SIZE_GROUP_WATERS } from "./menu.style";
import { ThemeProvider } from "styled-components";
import { themeMenu } from "@style";
import { Modal,  Box, ACTIONS_CONFIRM, ACTIONS_CLOSE } from "@modules/service/components/Modal";
import { MButtonGroup } from "@modules/service/components/ButtonGroup";
import ConnectivityComponent from "../connectivity/connectivity.component";
import InitializationComponent from "../initialization/initialization.component";
import { __ } from "@core/utils/lib/i18n";
import { ConfigContext, ConsumerContext, ServiceContext } from "@core/containers";
import CleaningComponent from "../cleaning/cleaning.component";
import EquipmentStatusComponent from "../equipmentStatus/equipmentStatus.component";

/* ==== MODALS ==== */
/* ======================================== */

enum Modals {
  Beverage,
  Cleaning,
  Language,
  EquipmentStatus,
  EquipmentConfiguration,
  Customize,
  Connectivity,
  Update,
  Timeout
}

interface ActionModals {
  type: "reset" | "open";
  modalToOpen?: Modals;
}

type StateModals = {
  [modal in Modals]: boolean;
};

const initialModals = {
  [Modals.Beverage]: false,
  [Modals.Cleaning]: false,
  [Modals.Language]: false,
  [Modals.EquipmentStatus]: false,
  [Modals.EquipmentConfiguration]: false,
  [Modals.Customize]: false,
  [Modals.Connectivity]: false,
  [Modals.Update]: false,
  [Modals.Timeout]: false
};

function reducerModals(state: StateModals, action: ActionModals) {
  switch (action.type) {
    case "reset":
      return initialModals;
    case "open":
      return {
        ...state,
        [action.modalToOpen]: true
      };
    default:
      throw new Error();
  }
}

/* ==== MAIN ==== */
/* ======================================== */

interface MenuProps {}

interface MenuState {
  languageList: any;
  languageSelected: any;
  videoList: any;
  videoSelected: any;
}

export const MenuComponent = (props: MenuProps) => {

  const [state, setState] = React.useState<MenuState>({
    languageList: [
      {label: "ENGLISH \n (United States)", value: 0},
      {label: "FRANCAIS (Canada)", value: 1},
      {label: "ESPANOL (Mexico)", value: 2}
    ],
    languageSelected: null,
    videoList: [
      {label: "video 1", value: 0},
      {label: "video 2", value: 1},
      {label: "video 3", value: 2}
    ],
    videoSelected: null,
  });

  const [modals, dispatchModals] = React.useReducer(reducerModals, initialModals);

  const configConsumer = React.useContext(ConfigContext);
  const serviceConsumer = React.useContext(ServiceContext);

  React.useEffect(() => {
    console.log("Menu => Consumer ;", serviceConsumer);
    return () => {
      console.log("close menu");
    };
  }, []);

  /* ==== HANDLE ==== */
  /* ======================================== */

  const handleLanguage = (value) => {
    console.log(value);
    setState(prevState => ({ ...prevState, languageSelected: value }));
  };

  // const handleVideo = (value) => {
  //   console.log(value);
  //   setState(prevState => ({ ...prevState, videoSelected: value }));
  // };

  const openModal = (modal: Modals) => {
    dispatchModals({ type: "open", modalToOpen: modal });
  };

  const closeAllModal = () => {
    dispatchModals({ type: "reset" });
  };

  /* ==== MAIN ==== */
  /* ======================================== */

  return (
    <ThemeProvider theme={themeMenu}>
      <React.Fragment>
        <MenuContent>
          <Grid>
            <Group title={__("LINES ASSIGNMENT")} size={SIZE_GROUP_LINES}>
              <MButton className="small" light info="Line - /">UNASSIGNED</MButton>
              <MButton className="small" light info="Line - /">UNASSIGNED</MButton>
              <MButton className="small" light info="Line - /">UNASSIGNED</MButton>
              <MButton className="small" light info="Line - /">UNASSIGNED</MButton>
              <MButton className="small" light info="Line - /">UNASSIGNED</MButton>
              <MButton className="small" light info="Line - /">UNASSIGNED</MButton>
            </Group>
            <Group title={__("WATERS")} size={SIZE_GROUP_WATERS}>
              <MButton className="small" info="Line - /">STILL AMBIENT</MButton>
              <MButton className="small" info="Line - /">STILL COLD</MButton>
              <MButton className="small" info="Line - /">CARB COLD</MButton>
            </Group>
            <Group title={__("ACTIONS")}>
              <MButton onClick={() => openModal(Modals.EquipmentConfiguration)}>EQUIPMENT CONFIGURATION</MButton>
              <MButton>PRIMING</MButton>
              <MButton onClick={() => openModal(Modals.Timeout)}>SELECTION TIMEOUT</MButton>
              <MButton onClick={() => openModal(Modals.Cleaning)}>SCREEN CLEANING</MButton>
              <MButton onClick={() => openModal(Modals.Customize)}>CUSTOMIZE UI</MButton>
              <MButton>SANITATION</MButton>
              <MButton>CHANGE PRICE</MButton>
            </Group>
            <Group title={__("SYSTEM")}>
              <MButton>SYSTEM REBOOT</MButton>
              <MButton>SYSTEM SHUTDOWN</MButton>
              <MButton onClick={() => openModal(Modals.Language)}>SERVICE LANGUAGE</MButton>
              <MButton onClick={() => openModal(Modals.Update)}>SOFTWARE UPDATE</MButton>
              <MButton onClick={() => openModal(Modals.Connectivity)} info type={MTypes.INFO_SUCCESS}>CONNECTIVITY</MButton>
              <MButton>ABOUT</MButton>
            </Group>
            <Group title={__("ALARMS")} size={SIZE_GROUP_ALARM}>
              <MButton onClick={() => openModal(Modals.EquipmentStatus)} info type={MTypes.INFO_DANGER}>EQUIPMENT STATUS</MButton>
            </Group>
            <Group id="info-group" size={SIZE_GROUP_INFO}>
              <ul>
                <li>COUNTRY: ———</li>
                <li>IMEI: ———</li>
                <li>MOTHERBOARD SERIAL NUMBER: ———</li>
                <li>MODEM SERIAL NUMBER: ———</li>
                <li>SIM CARD DETAILS: ———</li>
                <li>SERIAL NUMBER: ———</li>
                <li>FIRMWARE VERSION: ———</li>
                <li>SOFTWARE VERSION: ———</li>
              </ul>
            </Group>
            <MButton id="exit-btn" onClick={() => location.reload()}>EXIT TO COSUMER UI</MButton>
          </Grid>
        </MenuContent>

        <Modal
          show={modals[Modals.Update]}
          cancel={closeAllModal}
          title="update"
          subTitle="select desired action"
          content={
            <Box className="centered">
              <MButton>UPLOAD FROM USB</MButton>
              <MButton>UPDATE FROM REMOTE SERVER</MButton>
            </Box>
          }
          actions={ACTIONS_CLOSE}
        ></Modal>

        <Modal
          show={modals[Modals.Customize]}
          cancel={closeAllModal}
          title="CONSUMER UI"
          subTitle="SELECT DESIRED ACTION"
          content={
            <Box className="centered">
              <MButton>VIDEO SELECTION</MButton>
              <MButton>PAYMENT SELECTION</MButton>
            </Box>
          }
          actions={ACTIONS_CLOSE}
        ></Modal>

        <Modal
          show={modals[Modals.Timeout]}
          cancel={closeAllModal}
          title="SELECTION TIMEOUT"
          content={
            <div>
              <Box className="centered">
                <MButton disabled visibled light info="TIMEOUT">5 SECONDS</MButton>
              </Box>
              <Box className="centered">
                <MButton>DECREASE TIMEOUT</MButton>
                <MButton>INCREASE TIMEOUT</MButton>
              </Box>
            </div>
          }
          actions={ACTIONS_CONFIRM}
        ></Modal>

        {/* <Modal
          title={`LINE # ${1} - CURRENT ASSIGNMENT`}
          content={
            <div>
              <Box>
                <MButton disabled visibled light info="LINE - /">PEPSI</MButton>
                <div id="info-box">
                  <h3>PEPSI</h3>
                  <h3>SKU NO. -------------- V -</h3>
                </div>
              </Box>
              <Box className="centered">
                <MButton>LOCK DISPENSE</MButton>
                <MButton>CHANGE LINE ASSIGNMENT</MButton>
                <MButton>CALIBRATION</MButton>
                <MButton>PRIMING</MButton>
              </Box>
            </div>
          }
          actions={ACTIONS_CONFIRM}
        ></Modal> */}

        <Modal
          show={modals[Modals.EquipmentStatus]}
          cancel={closeAllModal}
          title="EQUIPMENT STATUS"
          content={<EquipmentStatusComponent />}
          actions={ACTIONS_CONFIRM}
        ></Modal>

        <Modal
          show={modals[Modals.Language]}
          cancel={closeAllModal}
          title="SERVICE LANGUAGE"
          subTitle="SELECT DESIRED LANGUAGE"
          content={
            <MButtonGroup
              options={state.languageList}
              value={state.languageSelected}
              onChange={(value) => handleLanguage(value)}
            />
          }
          actions={ACTIONS_CONFIRM}
        ></Modal>

        {/* <Modal
          show={modals[Modals.EquipmentConfiguration]}
          cancel={closeAllModal}
          title="VIDEO SELECTION"
          subTitle="SELECT DESIRED VIDEO"
          content={
            <MButtonGroup
              options={state.videoList}
              value={state.videoSelected}
              onChange={(value) => handleVideo(value)}
            />
          }
          actions={ACTIONS_CONFIRM}
        ></Modal> */}

        <Modal
          show={modals[Modals.Connectivity]}
          cancel={closeAllModal}
          title={__("Connectivity")}
          content={
            <ConnectivityComponent />
          }
          actions={ACTIONS_CONFIRM}
        ></Modal>

        {/* <Modal
          show={modals[Modals.EquipmentConfiguration]}
          cancel={closeAllModal}
          title={__("Equipment Configuration")}
          content={
            <InitializationComponent />
          }
          actions={ACTIONS_CONFIRM}
        ></Modal> */}

        <Modal
          show={modals[Modals.EquipmentConfiguration]}
          cancel={closeAllModal}
          title="EQUIPMENT CONFIGURATION"
          subTitle="SELECT DESIRED ACTION"
          content={
            <Box className="centered">
              <MButton>INITIAL SETUP</MButton>
              <MButton>MOTHERBOARD REPLACEMENT</MButton>
              <MButton>EQUIPMENT REPLACEMENT</MButton>
              <MButton>PICK UP</MButton>
            </Box>
          }
          actions={ACTIONS_CLOSE}
        ></Modal>

        <Modal
          show={modals[Modals.Cleaning]}
          cancel={closeAllModal}
          title={__("Screen Cleaning")}
          subTitle={__("SCREEN WILL CLOSE IN 30 SECONDS REMEBER TO DRY SCREEN")}
          content={
            <CleaningComponent />
          }
          actions={[]}
        ></Modal>

      </React.Fragment>
    </ThemeProvider>
  );
};

export default MenuComponent;
