import * as React from "react";
import { MButton, MTypes } from "@modules/service/components/Button";
import { MenuContent, Grid, Group, SIZE_GROUP_ALARM, SIZE_GROUP_INFO } from "./menu.style";
import { ThemeProvider } from "styled-components";
import { themeMenu } from "@style";

interface MenuProps {}

interface MenuState {}

export class MenuComponent extends React.Component<MenuProps, MenuState> {

  readonly state: MenuState;

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <ThemeProvider theme={themeMenu}>
        <MenuContent>
          <Grid>
            <Group title="LINES ASSIGNMENT">
              <MButton className="small" info="Line - /">UNASSIGNED</MButton>
              <MButton className="small" info="Line - /">UNASSIGNED</MButton>
              <MButton className="small" info="Line - /">UNASSIGNED</MButton>
              <MButton className="small" info="Line - /">UNASSIGNED</MButton>
              <MButton className="small" info="Line - /">UNASSIGNED</MButton>
              <MButton className="small" info="Line - /">UNASSIGNED</MButton>
              <MButton className="small" info="Line - /">UNASSIGNED</MButton>
              <MButton className="small" info="Line - /">UNASSIGNED</MButton>
              <MButton className="small" info="Line - /">UNASSIGNED</MButton>
            </Group>
            <Group title="ACTIONS">
              <MButton>INITIAL SETUP</MButton>
              <MButton>PRIMING</MButton>
              <MButton>SELECTION TIMEOUT</MButton>
              <MButton>SCREEN CLEANING</MButton>
              <MButton>VIDEO SELECTION</MButton>
              <MButton>SANITATION</MButton>
            </Group>
            <Group title="SYSTEM">
              <MButton>SYSTEM REBOOT</MButton>
              <MButton>SERVICE LANGUAGE</MButton>
              <MButton info type={MTypes.INFO_SUCCESS}>CONNECTIVITY</MButton>
              <MButton>UPDATE</MButton>
            </Group>
            <Group title="ALARMS" size={SIZE_GROUP_ALARM}>
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
            <MButton id="exit-btn">EXIT TO COSUMER UI</MButton>
          </Grid>
        </MenuContent>
      </ThemeProvider>
    );
  }
}

// export default MenuComponent;
