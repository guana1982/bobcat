import * as React from "react";
import styled from "styled-components";
import { __ } from "@core/utils/lib/i18n";

import { MButton, MTypes } from "@modules/service/components/common/Button";
import { ServiceContext, AuthLevels, AlertContext } from "@core/containers";
import { MenuContent } from "./Main";
import { Grid, Group } from "../components/main/Grid";
import { IMasterMenu, ITestMenu } from "@core/utils/APIModel";
import { element, func } from "prop-types";
import { Pages } from "@core/utils/constants";
import { MInput, InputContent } from "../components/common/Input";
import { MButtonGroup } from "../components/common/ButtonGroup";
import Switch from "react-switch";
import { ModalKeyboard, ModalKeyboardTypes } from "../components/common/ModalKeyboard";
import { tap } from "rxjs/operators";
import { of } from "rxjs";
import { TestMenu_ } from "@core/utils/APIMock";
import { Modal, ACTIONS_CLOSE, Action } from "../components/common/Modal";
import ConnectivityComponent from "../components/sections/Connectivity";

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
      ${InputContent}.read input {
        background: #D9D9D9;
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

export const TestMenu = (props: MasterProps) => {

  const serviceConsumer = React.useContext(ServiceContext);
  const alertConsumer = React.useContext(AlertContext);

  const [indexSelected, setIndexSelected] = React.useState({group: null, element: null});

  const [state, setState] = React.useState({ structure_: []});


  const [fieldSelected, setFieldSelected] = React.useState(null);

  const completeTest = () => {
    alert("ok");
  };

  function setValueForm(group, i, value) {
    setState(prevState => {
      const updatedValues = prevState;
      updatedValues.structure_[group].elements[i].value = value;
      return {...prevState, ...updatedValues};
    });
  }

  function setValueForSelect(changedValueIndex, value) {
    const list = state.structure_[indexSelected.group].elements[indexSelected.element].value;
    list[changedValueIndex].value = value;
    setValueForm(indexSelected.group, indexSelected.element, list);
  }

  React.useEffect(() => {
    // serviceConsumer.getMasterMenu()
    of(TestMenu_)
    .subscribe(
      data => { setState(data); console.log(data); },
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

  // React.useEffect(() => {
  //   let polling_ = null;
  //   if (fieldSelected === null) {
  //     polling_ = serviceConsumer.pollingMasterMenu()
  //     .subscribe(data => setPollingValues(data));
  //   }

  //   return () => {
  //     if (polling_)
  //       polling_.unsubscribe();
  //   };
  // }, [fieldSelected]);

  // function saveValues () {
  //   const { saveMasterMenu } = serviceConsumer;
  //   saveMasterMenu(state.form_)
  //   .subscribe(
  //     data => {
  //       history.push(Pages.Menu);
  //     },
  //     error => {
  //       console.error(error);
  //     }
  //   );
  // }

  const { structure_ } = state;
  const { history } = props;
  const currentModalSelect = indexSelected.group && indexSelected.element
    ? state.structure_[indexSelected.group].elements[indexSelected.element].value
    : null;

  console.log(state);

  if (!(structure_.length > 0))
    return <MenuContent />;

  return (
    <MenuContent className="scroll">
      <MasterContent>
        <Grid>
          {structure_.map((group, i) => (
            <Group key={i} title={__(group.label_id)}>
              {
                group.elements.map((element, i2) => {

                  if (element.type === "boolean")
                  return (
                    <div key={i + i2} className="boolean-box">
                      <span id="title">{__(element.label_id)}</span>
                      <Switch
                        onChange={(value) => setValueForm(i, i2, value)}
                        checked={element.value}
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

                  if (element.type === "custom_qr") {
                    return (
                      <CustomQr
                        key={i + i2}
                        element={element}
                      />
                    );
                  }

                  if (element.type === "custom_proximity") {
                    return (
                      <CustomProximity
                        key={i + i2}
                        element={element}
                      />
                    );
                  }

                  if (element.type === "custom_connectivity") {
                    return (
                      <CustomConnectivity
                        key={i + i2}
                        element={element}
                      />
                    );
                  }

                  if (element.type === "custom_alarm") {
                    return (
                      <CustomAllarm
                        key={i + i2}
                        element={element}
                      />
                    );
                  }

                  if (element.type === "custom_ada") {
                    return (
                      <CustomAda
                        key={i + i2}
                        element={element}
                      />
                    );
                  }

                  if (element.type === "custom_temperature") {
                    return (
                      <CustomTemperature
                        key={i + i2}
                        element={element}
                      />
                    );
                  }

                  if (element.type === "custom_waters") {
                    return (
                      <CustomWaters
                        key={i + i2}
                        element={element}
                      />
                    );
                  }

                  if (element.type === "custom_bibs") {
                    return (
                      <CustomBibs
                        key={i + i2}
                        element={element}
                      />
                    );
                  }

                  if (element.type === "text" || element.type === "password")
                  return (
                    <div key={i + i2} onClick={() => element.permission === "write" && setFieldSelected(element)} className="input-box">
                      <MInput
                        className={element.permission}
                        type={element.type}
                        label={__(element.label_id)}
                        value={""}
                      />
                      <span className="unit">{element.unit}</span>
                    </div>
                  );

                  // if (element.type === "modal")
                  // return (
                  //   <div key={i2} className="boolean-box">
                  //     <span id="title">{__(element.label_id)}</span>
                  //     <MButton
                  //       onClick={() => {
                  //         setIndexSelected({group: i, element: i2}),
                  //         openModal(Modals[element.modal]);
                  //       }}
                  //     >
                  //       {element.modal.toUpperCase()}
                  //     </MButton>
                  //   </div>
                  // );

                })
              }
            </Group>
          ))}
          <Group title="" size={74} />
          <MButton id="exit-btn" onClick={() => history.push(Pages.Menu)}>EXIT TO MASTER UI</MButton>
          <MButton id="exit-btn" onClick={() => completeTest()}>COMPLETE TEST</MButton>
        </Grid>
      </MasterContent>

      {
        fieldSelected !== null &&
        <ModalKeyboard
          title={__(fieldSelected.label_id)}
          type={ModalKeyboardTypes.Full}
          form={""}
          cancel={() => setFieldSelected(null)}
          finish={(value) => {}}
        />
      }

    </MenuContent>
  );
};

/* ==== COMPONENTS ==== */
/* ======================================== */

const CustomQr = (props) => {
  return (
    <>
      <h2>CUSTOM QR</h2>
      <Modal
        show={false}
        cancel={() => {}}
        title={__("Qr")}
        actions={[/* ...actionsConnectivity */, ...ACTIONS_CLOSE]}
      >
        <div style={{width: "100%", height: "300px"}}>
          <div style={{background: "#0000ff", width: "300px", height: "300px"}}></div>
        </div>
      </Modal>
    </>
  );
};

const CustomConnectivity = (props) => {

  //  ==== ACTIONS CONNECTIVITY ====>
  const [actionsConnectivity, setActionsConnectivity] = React.useState<Action[]>([]);
  const handleActionsConnectivity = (actions): void => setActionsConnectivity(actions);
  //  <=== ACTIONS CONNECTIVITY ====

  return (
    <>
      <h2>CUSTOM CONNECTIVITY</h2>
      <Modal
        show={false}
        cancel={() => {}}
        title={__("Connectivity")}
        actions={[...actionsConnectivity, ...ACTIONS_CLOSE]}
      >
        <ConnectivityComponent handleActions={handleActionsConnectivity} />
      </Modal>
    </>
  );
};

const CustomProximity = (props) => {
  return (
    <>
      <h2>CUSTOM PROXIMITY</h2>
      {/* <Grid>
        <span>Distance</span>
        { indexSelected.group && state.structure_[indexSelected.group].elements[indexSelected.element].value.map((v, i) =>
            <MButton
              onClick={() => setValueForSelect(i, true)}
              info
              type={v.value ? MTypes.INFO_SUCCESS : MTypes.INFO_WARNING}
            >
              {v.distance} cm
            </MButton>
          )

        }
      </Grid> */}
    </>
  );
};

const CustomTemperature = (props) => {
  return (
    <>
      <h2>CUSTOM TEMPERATURE</h2>
    </>
  );
};

const CustomAllarm = (props) => {
  return (
    <>
      <h2>CUSTOM ALLARM</h2>
    </>
  );
};

const CustomAda = (props) => {
  return (
    <>
      <h2>CUSTOM ADA</h2>
    </>
  );
};

const CustomWaters = (props) => {
  return (
    <>
      <h2>CUSTOM WATERS</h2>
      <CustomCalibration />
    </>
  );
};

const CustomBibs = (props) => {
  return (
    <>
      <h2>CUSTOM WATERS</h2>
      <CustomCalibration />
    </>
  );
};

const CustomCalibration = (props) => {
  return (
    <>
      <h2>CUSTOM CALIBRATION</h2>
    </>
  );
};