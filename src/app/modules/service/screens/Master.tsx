import * as React from "react";
import styled from "styled-components";
import { __ } from "@core/utils/lib/i18n";

import { MButton, MTypes } from "@modules/service/components/common/Button";
import { ServiceContext, AuthLevels, AlertContext } from "@core/containers";
import { MenuContent } from "./Main";
import { Grid, Group } from "../components/main/Grid";
import { IMasterMenu } from "@core/utils/APIModel";
import { element } from "prop-types";
import { Pages } from "@core/utils/constants";
import { MInput } from "../components/common/Input";
import { MButtonGroup } from "../components/common/ButtonGroup";

/* ==== ELEMENTS ==== */
/* ======================================== */



/* ==== MASTER ==== */
/* ======================================== */

interface MasterProps {
  authLevel: AuthLevels;
  history: any;
}

interface MasterState {

}

export const MasterMenu = (props: MasterProps) => {

  const serviceConsumer = React.useContext(ServiceContext);
  const alertConsumer = React.useContext(AlertContext);

  const [state, setState] = React.useState<IMasterMenu>({
    type: "",
    elements: [],
    $groups: [],
    save: { label_id: "" },
    id: "",
    label_id: ""
  });

  React.useEffect(() => {
    serviceConsumer.getMasterMenu()
    .subscribe(
      data => setState(data),
      error => {
        const evtError_ = () => {
          history.push(Pages.Menu);
        };
        alertConsumer.show({
          timeout: true,
          title: "ERROR",
          content: "ERROR LOAD MASTER UI",
          onConfirm: evtError_
        });
      }
    );
  }, []);

  React.useEffect(() => {
    console.log({state});
  }, [state]);

  function saveValues () {
    const { saveMasterMenu } = serviceConsumer;
    saveMasterMenu(state)
    .subscribe(
      data => {
        location.reload();
      },
      error => {
        console.error(error);
      }
    );
  }

  const { $groups } = state;
  const { history } = props;

  if (!($groups.length > 0))
    return <MenuContent />;

  return (
    <MenuContent className="scroll">
      <Grid>
        {$groups.map((group, i) => (
          <Group key={i} title={__(group.label_id)}>
            {
              group.elements.map(element => {

                if (element.type === "text" || element.type === "number")
                return (
                  <MInput
                    type={element.type}
                    label={__(element.label_id)}
                    value={element.value}
                    onChange={value => console.log(element.label_id, value)}
                  />
                );

                if (element.type === "select" || element.type === "multi") {
                  const options = [];
                  element.value.forEach(value => {
                    options.push({
                      "label": value,
                      "value": value
                    });
                  });
                  return (
                    <MButtonGroup
                      options={options}
                      value={element.value}
                      onChange={(value) => console.log(element.label_id, value)}
                    />
                  );
                }
              })
            }
          </Group>
        ))}
        <Group title="" size={74} />
        <MButton id="exit-btn" onClick={() => history.push(Pages.Menu)}>EXIT TO MASTER UI</MButton>
        <MButton id="exit-btn" onClick={() => saveValues()}>SAVE VALUES</MButton>
      </Grid>
    </MenuContent>
  );
};
