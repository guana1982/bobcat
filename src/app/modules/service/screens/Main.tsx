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

/* ==== STYLE ==== */
/* ======================================== */

interface HomeContentProps { beverageIsSelected?: boolean; }
export const MenuContent = styled<HomeContentProps, "div">("div")`
  * {
      font-family: Karla-Reg !important;
  }

  background: ${props => props.theme.dark};
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
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

interface MenuProps {}

interface MenuState {
  languageList: any;
  languageSelected: any;
  videoList: any;
  videoSelected: any;
}

export const NewMenu = (props: MenuProps) => {

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

  const openModal = (modal: Modals, params?: any) => {
    dispatchModals({ type: "open", modalToOpen: modal, params: params });
  };

  const closeAllModal = () => {
    dispatchModals({ type: "reset" });
  };

  /* ==== MAIN ==== */
  /* ======================================== */

  const { lines, authLevel, statusAlarms, statusConnectivity } = serviceConsumer;

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

  return (
    <>
      <MenuContent>
        <Grid>
          <Group title={__("s_lines_assignment")} size={authLevel !== AuthLevels.Crew ? SIZE_GROUP_LINES : SIZE_FULL_GROUP_LINES}>
            {lines.pumps.map((line, i) => {
              return (
                <MButton disabled={authLevel === AuthLevels.Super} onClick={() => openModal(Modals.Line, { lineId: line.line_id })} key={i} className="small" light info={`${__("s_line")} - ${line.line_id}`}>
                  {line.$beverage ? <BeverageLogo beverage={line.$beverage} size="tiny" /> : __("s_unassigned")}
                </MButton>
              );
            })}
          </Group>
          {authLevel !== AuthLevels.Crew &&
            <Group title={__("s_waters")} size={SIZE_GROUP_WATERS}>
              {lines.waters.map((line, i) => {
                return (
                  <MButton disabled={authLevel === AuthLevels.Super} onClick={() => openModal(Modals.Line, { lineId: line.line_id })} key={i} className="small" light info={`${__(`s_${line.$beverage.beverage_type}`)} - ${line.line_id}`}>
                    {line.$beverage ? <BeverageLogo beverage={line.$beverage} size="tiny" /> : __("s_unassigned")}
                  </MButton>
                );
              })}
            </Group>
          }
          <Group title={__("s_actions")}>
            {
              authLevel === AuthLevels.Crew &&
              <>
                <MButton onClick={() => openModal(Modals.Cleaning)}>{__("s_screen_cleaning")}</MButton>
                <MButton onClick={() => openModal(Modals.Sanitation)}>{__("s_sanitation")}</MButton>
              </>
            }
            {
              authLevel === AuthLevels.Tech &&
              <>
                <MButton onClick={() => openModal(Modals.EquipmentConfiguration)}>{__("s_equipment_configuration")}</MButton>
                <MButton onClick={() => openModal(Modals.Timeout)}>{__("s_video_timeout")}</MButton>
                <MButton onClick={() => openModal(Modals.Cleaning)}>{__("s_screen_cleaning")}</MButton>
                <MButton onClick={() => openModal(Modals.Customize)}>{__("s_customize_ui")}</MButton>
                <MButton onClick={() => openModal(Modals.Sanitation)}>{__("s_sanitation")}</MButton>
                {/* <MButton onClick={() => openModal(Modals.ChangePrice)}>{__("s_change_price")}</MButton> */}
              </>
            }
            {
              authLevel === AuthLevels.Super &&
              <>
                <MButton onClick={() => openModal(Modals.EquipmentConfiguration, { setup: SetupTypes.Inizialization })}>{__("s_initial_setup")}</MButton>
                {/* <MButton onClick={() => openModal(Modals.Customize, { selection: SelectionTypes.Payment })}>FREE / PAID</MButton> */}
              </>
            }
          </Group>
          <Group title={__("s_system")}>
            {
              authLevel === AuthLevels.Crew &&
              <>
                <MButton onClick={rebootEvent}>{__("s_system_reboot")}</MButton>
                {/* <MButton>SYSTEM SHUTDOWN</MButton> */}
                <MButton onClick={() => openModal(Modals.About)}>{__("s_about")}</MButton>
              </>
            }
            {
              authLevel === AuthLevels.Tech &&
              <>
                <MButton onClick={rebootEvent}>{__("s_system_reboot")}</MButton>
                {/* <MButton>SYSTEM SHUTDOWN</MButton> */}
                <MButton onClick={() => openModal(Modals.Language)}>{__("s_service_language")}</MButton>
                <MButton onClick={() => openModal(Modals.Update)}>{__("s_software_update")}</MButton>
                <MButton onClick={() => openModal(Modals.Connectivity)} info type={statusConnectivity}>{__("s_connectivity")}</MButton>
              </>
            }
            {
              authLevel === AuthLevels.Super &&
              <>
                <MButton onClick={rebootEvent}>{__("s_system_reboot")}</MButton>
                {/* <MButton>SYSTEM SHUTDOWN</MButton> */}
                {/* <MButton onClick={() => openModal(Modals.Language)}>SERVICE LANGUAGE</MButton>
                <MButton onClick={() => openModal(Modals.Connectivity)} info type={statusConnectivity}>CONNECTIVITY</MButton> */}
              </>
            }
          </Group>
          <Group title={__("s_alarms")} size={authLevel !== AuthLevels.Crew ? SIZE_GROUP_ALARM : SIZE_FULL_GROUP_ALARM}>
            <MButton onClick={() => openModal(Modals.EquipmentStatus)} info type={statusAlarms}>{__("s_equipment_status")}</MButton>
          </Group>
          {authLevel !== AuthLevels.Crew &&
            <Group id="info-group" size={SIZE_GROUP_INFO}>
              <About />
            </Group>
          }
          <MButton id="exit-btn" onClick={() => location.reload()}>{__("s_exit_main")}</MButton>
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
          title={__("s_connectivity")}
          actions={[...actionsConnectivity, ...ACTIONS_CLOSE]}
        >
          <ConnectivityComponent handleActions={handleActionsConnectivity} />
        </Modal>
      }

      <Modal
        themeMode={ModalTheme.Dark}
        show={modals[Modals.About].show}
        cancel={closeAllModal}
        title={__("s_about")}
        actions={ACTIONS_CLOSE}
      >
        <About />
      </Modal>
    </>
  );
};
