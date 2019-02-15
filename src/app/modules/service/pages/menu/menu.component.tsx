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

interface MenuProps {}

interface MenuState {
  languageList: any;
  languageSelected: any;
  videoList: any;
  videoSelected: any;
}

// MenuProps, MenuStat

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


  /* ==== HANDLE ==== */
  /* ======================================== */

  const handleLanguage = (value) => {
    console.log(value);
    setState(prevState => ({ ...prevState, languageSelected: value }));
  };

  const handleVideo = (value) => {
    console.log(value);
    setState(prevState => ({ ...prevState, videoSelected: value }));
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
              <MButton>INITIAL SETUP</MButton>
              <MButton>PRIMING</MButton>
              <MButton>SELECTION TIMEOUT</MButton>
              <MButton>SCREEN CLEANING</MButton>
              <MButton>VIDEO SELECTION</MButton>
              <MButton>SANITATION</MButton>
            </Group>
            <Group title={__("SYSTEM")}>
              <MButton>SYSTEM REBOOT</MButton>
              <MButton>SERVICE LANGUAGE</MButton>
              <MButton info type={MTypes.INFO_SUCCESS}>CONNECTIVITY</MButton>
              <MButton>UPDATE</MButton>
            </Group>
            <Group title={__("ALARMS")} size={SIZE_GROUP_ALARM}>
              <MButton info type={MTypes.INFO_DANGER}>EQUIPMENT STATUS</MButton>
            </Group>
            <Group id="info-group" size={SIZE_GROUP_INFO}>
              <ul>
                <li>PLATFORM: ———</li>
                <li>RECIPE VERSION: ———</li>
                <li>ACCESS LEVEL: ———</li>
                <li>SOFTWARE VERSION: ———</li>
                <li>DISK IMAGE VERSION: ———</li>
                <li>BIOS VERSION: ———</li>
              </ul>
            </Group>
            <MButton id="exit-btn" onClick={() => location.reload()}>EXIT TO COSUMER UI</MButton>
          </Grid>
        </MenuContent>

        {/* <Modal
          title="update"
          subTitle="select desired action"
          content={
            <Box className="centered">
              <MButton>UPLOAD FROM USB</MButton>
              <MButton>UPLOAD NEW VIDEO</MButton>
              <MButton>UPDATE FROM SERVER</MButton>
              <MButton>UPDATE FIRMWARE</MButton>
            </Box>
          }
          actions={ACTIONS_CLOSE}
        ></Modal> */}

        {/* <Modal
          title="initial setup"
          subTitle="select desired action"
          content={
            <Box className="centered">
              <MButton>FIRST ACTIVATION</MButton>
              <MButton>MOTHERBOARD SUBSTITUTION</MButton>
              <MButton>PICK UP</MButton>
              <MButton>EQUIPMENT SUBSTITUTION</MButton>
            </Box>
          }
          actions={ACTIONS_CLOSE}
        ></Modal> */}

        {/* <Modal
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
        ></Modal> */}

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

        {/* <Modal
          title="EQUIPMENT STATUS"
          content={
            <div>
              <Box className="elements centered">
                <MButton type={MTypes.INFO_SUCCESS} className="small" light info>---</MButton>
                <MButton type={MTypes.INFO_SUCCESS} className="small" light info>---</MButton>
                <MButton type={MTypes.INFO_DANGER} className="small" light info>---</MButton>
                <MButton type={MTypes.INFO_DANGER} className="small" light info>---</MButton>
                <MButton type={MTypes.INFO_WARNING} className="small" light info>---</MButton>
                <MButton type={MTypes.INFO_SUCCESS} className="small" light info>---</MButton>
                <MButton type={MTypes.INFO_SUCCESS} className="small" light info>---</MButton>
                <MButton type={MTypes.INFO_SUCCESS} className="small" light info>---</MButton>
                <MButton type={MTypes.INFO_SUCCESS} className="small" light info>---</MButton>
                <MButton type={MTypes.INFO_DANGER} className="small" light info>---</MButton>
                <MButton type={MTypes.INFO_DANGER} className="small" light info>---</MButton>
                <MButton type={MTypes.INFO_SUCCESS} className="small" light info>---</MButton>
                <MButton type={MTypes.INFO_SUCCESS} className="small" light info>---</MButton>
                <MButton type={MTypes.INFO_SUCCESS} className="small" light info>---</MButton>
              </Box>
              <Box className="container">
                <h2 id="title">info</h2>
                <h4>
                  --------------
                  --------------
                  --------------
                  --------------
                </h4>
              </Box>
            </div>
          }
          actions={ACTIONS_CONFIRM}
        ></Modal> */}

        {/* <Modal
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
        ></Modal> */}

        {/* <Modal
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

        {/* <ConnectivityComponent /> */}

        {/* <InitializationComponent /> */}

      </React.Fragment>
    </ThemeProvider>
  );
};

export default MenuComponent;
