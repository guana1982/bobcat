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
import { MInput, InputContent } from "../components/common/Input";
import { MButtonGroup } from "../components/common/ButtonGroup";
import Switch from "react-switch";
import { ModalKeyboard, ModalKeyboardTypes } from "../components/common/ModalKeyboard";
import { tap } from "rxjs/operators";

/* ==== ELEMENTS ==== */
/* ======================================== */

export const MasterContent = styled.div`
  ${Group} {
    flex-direction: column;
    padding-top: 50px;
    padding-left: 20px;
    padding-bottom: 20px;
    &>div {
      margin: 6px;
      align-self: flex-start;
    }
    .input-box {
      display: flex;
      align-items: center;
      ${InputContent}.read input {
        background: #D9D9D9;
      }
      .unit {
        font-size: 1.2rem;
        font-weight: 600;
        margin-left: 10px;
      }
    }
    .select-box {
      padding: 15px;
      border: 1px solid black;
      border-radius: 20px;
      #title {
        text-transform: uppercase;
        font-size: 1.2rem;
      }
    }
    .vector-number-box {
      display: flex;
      align-items: center;
      padding: 5px 10px;
      border: 1px solid black;
      border-radius: 20px;
      &>div {
        padding-left: 10px;
      }
      #title {
        text-transform: uppercase;
        font-size: 1.2rem;
      }
      .values {
        font-size: 1.7rem;
        max-width: 800px;
        .value:not(:nth-child(1)):before {
          content: ", "
        }
      }
    }
    .boolean-box {
      display: flex;
      align-items: center;
      #title {
        display: inline-block;
        color: #383838;
        text-transform: capitalize;
        text-align: right;
        font-size: 1.2rem;
        font-weight: 600;
        margin-right: 10px;
      }
    }
  }
  #exit-btn {
    min-height: 120px;
  }
`;

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

  const [pollingValues, setPollingValues] = React.useState({});

  const [fieldSelected, setFieldSelected] = React.useState(null);

  const [state, setState] = React.useState<IMasterMenu>({
    type: "",
    elements: [],
    form_: [],
    structure_: [],
    save: { label_id: "" },
    id: "",
    label_id: ""
  });

  function setValueForm(id, value) {
    setState(prevState => {
      const updatedValues = prevState;
      updatedValues.form_[id] = value;
      return {...prevState, ...updatedValues};
    });
  }

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
    let polling_ = null;
    if (fieldSelected === null) {
      polling_ = serviceConsumer.pollingMasterMenu()
      .subscribe(data => setPollingValues(data));
    }

    return () => {
      if (polling_)
        polling_.unsubscribe();
    };
  }, [fieldSelected]);

  function saveValues () {
    const { saveMasterMenu } = serviceConsumer;
    saveMasterMenu(state.form_)
    .subscribe(
      data => {
        history.push(Pages.Menu);
      },
      error => {
        console.error(error);
      }
    );
  }

  const { structure_, form_ } = state;
  const { history } = props;

  if (!(structure_.length > 0))
    return <MenuContent />;

  return (
    <MenuContent className="scroll">
      <MasterContent>
        <Grid>
          {structure_.map((group, i) => (
            <Group key={i} title={__(group.label_id)}>
              {
                group.elements.map((element, i) => {

                  if ((element.type === "text" || element.type === "number")) {
                    return (
                      <div key={i} onClick={() => element.permission === "write" && setFieldSelected(element)} className="input-box">
                        <MInput
                          className={element.permission}
                          type={element.type}
                          label={__(element.label_id)}
                          value={element.permission === "write" ? form_[element.id] : pollingValues[element.id] || form_[element.id]}
                        />
                        <span className="unit">{element.unit}</span>
                      </div>
                    );
                  }

                  if (element.type === "vector-number") {
                    return (
                      <div key={i} className="vector-number-box">
                        <div>
                          <span id="title">{__(element.label_id)}{element.unit ? ` [${element.unit}]` : ""}</span>
                          <div className="values">
                            [
                            {form_[element.id].map((value, i) => (
                              <span className="value" key={i}>{value}</span>
                            ))}
                            ]
                          </div>
                        </div>
                        <MButton className="tiny" onClick={() => setFieldSelected(element)}>EDIT VALUES</MButton>
                      </div>
                    );
                  }

                  if (element.type === "select") { // || element.type === "multi"
                    const options = [];
                    element.value.forEach(value => {
                      options.push({
                        "label": value,
                        "value": value
                      });
                    });
                    return (
                      <div key={i} className="select-box">
                        <span id="title">{__(element.label_id)}</span>
                        <MButtonGroup
                          options={options}
                          value={form_[element.id]}
                          onChange={(value) => setValueForm(element.id, value)}
                        />
                      </div>
                    );
                  }

                  if (element.type === "boolean")
                  return (
                    <div key={i} className="boolean-box">
                      <span id="title">{__(element.label_id)}</span>
                      <Switch
                        onChange={(value) => console.log(value)}
                        checked={element.default_value}
                        onColor="#00c040"
                        onHandleColor="#009933"
                        handleDiameter={30}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={20}
                        width={48}
                        className="react-switch"
                        id="material-switch"
                      />
                    </div>
                  );

                })
              }
            </Group>
          ))}
          <Group title="" size={74} />
          <MButton id="exit-btn" onClick={() => history.push(Pages.Menu)}>EXIT TO MASTER UI</MButton>
          <MButton id="exit-btn" onClick={() => saveValues()}>SAVE VALUES</MButton>
        </Grid>
      </MasterContent>
      {
        fieldSelected !== null &&
        <ModalKeyboard
          title={__(fieldSelected.label_id)}
          type={fieldSelected.type === "text" ? ModalKeyboardTypes.Full : fieldSelected.type}
          form={fieldSelected.type === "vector-number" ? form_[fieldSelected.id] : [form_[fieldSelected.id]]  }
          cancel={() => setFieldSelected(null)}
          finish={(value) => setValueForm(fieldSelected.id, Array.isArray(value) ? value.map(v => Number(v)) : Number(value))}
        />
      }
    </MenuContent>
  );
};
