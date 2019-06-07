import * as React from "react";
import styled from "styled-components";
import { __ } from "@core/utils/lib/i18n";

import { MButton, MTypes } from "@modules/service/components/common/Button";
import { Modal,  Box, ACTIONS_CONFIRM, ACTIONS_CLOSE, ModalTheme, Action } from "@modules/service/components/common/Modal";
import ConnectivityComponent from "../components/sections/Connectivity";
import { About } from "../components/sections/About";
import { ServiceContext, AuthLevels, AlertContext } from "@core/containers";
import BeverageLogo from "@core/components/common/Logo";
import { Line } from "../components/modals/Line";
import { ChangePrice } from "../components/modals/ChangePrice";
import { EquipmentConfiguration, SetupTypes } from "../components/modals/EquipmentConfiguration";
import { Cleaning } from "../components/modals/Cleaning";
import { EquipmentStatus } from "../components/modals/EquipmentStatus";
import { Grid, Group, SIZE_GROUP_LINES, SIZE_GROUP_WATERS, SIZE_GROUP_ALARM, SIZE_GROUP_INFO, SIZE_FULL_GROUP_ALARM, SIZE_FULL_GROUP_LINES } from "../components/main/Grid";
import { Customize, SelectionTypes } from "../components/modals/Customize";
import { Update } from "../components/modals/Update";
import { Timeout } from "../components/modals/Timeout";
import { Sanitation } from "../components/modals/Sanitation";
import { Pages } from "@core/utils/constants";

/* ==== STYLE ==== */
/* ======================================== */

interface MenuContentProps { beverageIsSelected?: boolean; }
export const MenuContent = styled<MenuContentProps, "div">("div")`
  * {
      font-family: Karla-Reg !important;
  }
  background: ${props => props.theme.dark};
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  &.scroll {
    overflow-y: auto;
  }
`;

/* ==== MODALS ==== */
/* ======================================== */

enum Modals {
  Line,
  Cleaning,
  ChangePrice,
  Language,
  EquipmentStatus,
  EquipmentConfiguration,
  Customize,
  Connectivity,
  Update,
  Timeout,
  Sanitation,
  About
}

interface ActionModals {
  type: "reset" | "open";
  modalToOpen?: Modals;
  params?: any;
}

type StateModals = {
  [modal in Modals]: { show: boolean; params?: any };
};

const initModal = { show: false , params: null };
const initialModals = {
  [Modals.Line]: initModal,
  [Modals.Cleaning]: initModal,
  [Modals.ChangePrice]: initModal,
  [Modals.Language]: initModal,
  [Modals.EquipmentStatus]: initModal,
  [Modals.EquipmentConfiguration]: initModal,
  [Modals.Customize]: initModal,
  [Modals.Connectivity]: initModal,
  [Modals.Update]: initModal,
  [Modals.Timeout]: initModal,
  [Modals.Sanitation]: initModal,
  [Modals.About]: initModal,
};

function reducerModals(state: StateModals, action: ActionModals) {
  switch (action.type) {
    case "reset":
      return initialModals;
    case "open":
    console.log("action", action);
      return {
        ...state,
        [action.modalToOpen]: { show: true, params: action.params}
      };
    default:
      throw new Error();
  }
}

/* ==== MAIN ==== */
/* ======================================== */

interface MenuProps {
  authLevel: AuthLevels;
  history: any;
}

interface MenuState {
  languageList: any;
  languageSelected: any;
  videoList: any;
  videoSelected: any;
}

export const NewMenu = (props: MenuProps) => {

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

  const serviceConsumer = React.useContext(ServiceContext);
  const alertConsumer = React.useContext(AlertContext);

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

  const openModal = (modal: Modals, params?: any) => {
    dispatchModals({ type: "open", modalToOpen: modal, params: params });
  };

  const closeAllModal = () => {
    dispatchModals({ type: "reset" });
  };

  /* ==== MAIN ==== */
  /* ======================================== */

  const { lines, statusAlarms, statusConnectivity } = serviceConsumer;
  const { authLevel } = props;

  if (!authLevel)
  return (
    <>
      <h2>No Auth!</h2>
      <button onClick={() => location.reload()}><h3>EXIT</h3></button>
    </>
  );

  //  ==== ACTIONS CONNECTIVITY ====>
  const [actionsConnectivity, setActionsConnectivity] = React.useState<Action[]>([]);
  const handleActionsConnectivity = (actions): void => setActionsConnectivity(actions);
  //  <=== ACTIONS CONNECTIVITY ====

  const rebootEvent = () => {
    alertConsumer.show({
      timeout: false,
      title: "REBOOT",
      content: "ARE YOU SURE THAT YOU WANT TO REBOOT?",
      onConfirm: serviceConsumer.reboot
    });
  };

  const { history } = props;

  return (
    <>
      <MenuContent>
        <Grid>
          <Group title={__("LINES ASSIGNMENT")} size={authLevel !== AuthLevels.Crew ? SIZE_GROUP_LINES : SIZE_FULL_GROUP_LINES}>
            {lines.pumps.map((line, i) => {
              return (
                <MButton disabled={authLevel === AuthLevels.Super} onClick={() => openModal(Modals.Line, { lineId: line.line_id })} key={i} className="small" light info={`Line - ${line.line_id}`}>
                  {line.$beverage ? <BeverageLogo beverage={line.$beverage} size="tiny" /> : "UNASSIGNED"}
                </MButton>
              );
            })}
          </Group>
          {authLevel !== AuthLevels.Crew &&
            <Group title={__("WATERS")} size={SIZE_GROUP_WATERS}>
              {lines.waters.map((line, i) => {
                return (
                  <MButton disabled={authLevel === AuthLevels.Super} onClick={() => openModal(Modals.Line, { lineId: line.line_id })} key={i} className="small" light info={`${line.$beverage.beverage_type} - ${line.line_id}`}>
                    {line.$beverage ? <BeverageLogo beverage={line.$beverage} size="tiny" /> : "UNASSIGNED"}
                  </MButton>
                );
              })}
            </Group>
          }
          <Group title={__("ACTIONS")}>
            {
              authLevel === AuthLevels.Crew &&
              <>
                <MButton onClick={() => openModal(Modals.Cleaning)}>SCREEN CLEANING</MButton>
                <MButton onClick={() => openModal(Modals.Sanitation)}>SANITATION</MButton>
              </>
            }
            {
              authLevel === AuthLevels.Tech &&
              <>
                <MButton onClick={() => openModal(Modals.EquipmentConfiguration)}>EQUIPMENT CONFIGURATION</MButton>
                <MButton onClick={() => openModal(Modals.Timeout)}>VIDEO TIMEOUT</MButton>
                <MButton onClick={() => openModal(Modals.Cleaning)}>SCREEN CLEANING</MButton>
                <MButton onClick={() => openModal(Modals.Customize)}>CUSTOMIZE UI</MButton>
                <MButton onClick={() => openModal(Modals.Sanitation)}>SANITATION</MButton>
                {/* <MButton onClick={() => openModal(Modals.ChangePrice)}>CHANGE PRICE</MButton> */}
              </>
            }
            {
              authLevel === AuthLevels.Super &&
              <>
                <MButton onClick={() => openModal(Modals.EquipmentConfiguration, { setup: SetupTypes.Inizialization })}>INITIAL SETUP</MButton>
                {/* <MButton onClick={() => openModal(Modals.Customize, { selection: SelectionTypes.Payment })}>FREE / PAID</MButton> */}
              </>
            }
          </Group>
          <Group title={__("SYSTEM")}>
            {
              authLevel === AuthLevels.Crew &&
              <>
                <MButton onClick={rebootEvent}>SYSTEM REBOOT</MButton>
                {/* <MButton>SYSTEM SHUTDOWN</MButton> */}
                <MButton onClick={() => openModal(Modals.About)}>ABOUT</MButton>
              </>
            }
            {
              authLevel === AuthLevels.Tech &&
              <>
                <MButton onClick={rebootEvent}>SYSTEM REBOOT</MButton>
                {/* <MButton>SYSTEM SHUTDOWN</MButton> */}
                <MButton onClick={() => openModal(Modals.Language)}>SERVICE LANGUAGE</MButton>
                <MButton onClick={() => openModal(Modals.Update)}>SOFTWARE UPDATE</MButton>
                <MButton onClick={() => openModal(Modals.Connectivity)} info type={statusConnectivity}>CONNECTIVITY</MButton>
              </>
            }
            {
              authLevel === AuthLevels.Super &&
              <>
                <MButton onClick={rebootEvent}>SYSTEM REBOOT</MButton>
                {/* <MButton onClick={() => history.push(Pages.Master)}>MASTER MENU</MButton> */}

                {/* <MButton>SYSTEM SHUTDOWN</MButton> */}
                {/* <MButton onClick={() => openModal(Modals.Language)}>SERVICE LANGUAGE</MButton>
                <MButton onClick={() => openModal(Modals.Connectivity)} info type={statusConnectivity}>CONNECTIVITY</MButton> */}
              </>
            }
          </Group>
          <Group title={__("ALARMS")} size={authLevel !== AuthLevels.Crew ? SIZE_GROUP_ALARM : SIZE_FULL_GROUP_ALARM}>
            <MButton onClick={() => openModal(Modals.EquipmentStatus)} info type={statusAlarms}>EQUIPMENT STATUS</MButton>
          </Group>
          {authLevel !== AuthLevels.Crew &&
            <Group id="info-group" size={SIZE_GROUP_INFO}>
              <About />
            </Group>
          }
          <MButton id="exit-btn" onClick={() => location.reload()}>EXIT TO CONSUMER UI</MButton>
        </Grid>
      </MenuContent>

      {modals[Modals.Line].show && <Line {...modals[Modals.Line].params} cancel={closeAllModal} />}
      {modals[Modals.ChangePrice].show && <ChangePrice cancel={closeAllModal} />}
      {modals[Modals.EquipmentConfiguration].show && <EquipmentConfiguration {...modals[Modals.EquipmentConfiguration].params} cancel={closeAllModal} />}
      {modals[Modals.Cleaning].show && <Cleaning cancel={closeAllModal} />}
      {modals[Modals.EquipmentStatus].show && <EquipmentStatus cancel={closeAllModal} />}
      {modals[Modals.Sanitation].show && <Sanitation cancel={closeAllModal} />}

      {modals[Modals.Update].show && <Update cancel={closeAllModal} />}
      {modals[Modals.Timeout].show && <Timeout cancel={closeAllModal} />}

      {modals[Modals.Customize].show && <Customize {...modals[Modals.Customize].params} cancel={closeAllModal} />}
      {modals[Modals.Language].show && <Customize selection={SelectionTypes.Language} cancel={closeAllModal} />}

      {modals[Modals.Connectivity].show &&
        <Modal
          show={modals[Modals.Connectivity].show}
          cancel={closeAllModal}
          title={__("Connectivity")}
          actions={[...actionsConnectivity, ...ACTIONS_CLOSE]}
        >
          <ConnectivityComponent handleActions={handleActionsConnectivity} />
        </Modal>
      }

      <Modal
        themeMode={ModalTheme.Dark}
        show={modals[Modals.About].show}
        cancel={closeAllModal}
        title={__("About")}
        actions={ACTIONS_CLOSE}
      >
        <About />
      </Modal>
    </>
  );
};
