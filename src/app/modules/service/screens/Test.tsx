import * as React from "react";
import styled from "styled-components";
import { __ } from "@core/utils/lib/i18n";

import { MButton, MTypes } from "@modules/service/components/common/Button";
import { ServiceContext, AuthLevels, AlertContext, ConfigContext, KeyMapping } from "@core/containers";
import { MenuContent } from "./Main";
import { Grid, Group } from "../components/main/Grid";
import { IMasterMenu, ITestMenu } from "@core/utils/APIModel";
import { element, func } from "prop-types";
import { Pages, SOCKET_CONSUMER } from "@core/utils/constants";
import { MInput, InputContent } from "../components/common/Input";
import { MButtonGroup } from "../components/common/ButtonGroup";
import Switch from "react-switch";
import { ModalKeyboard, ModalKeyboardTypes } from "../components/common/ModalKeyboard";
import { tap, concatMap, map, mergeMap } from "rxjs/operators";
import { of, Observable, timer } from "rxjs";
import { TestMenu_ } from "@core/utils/APIMock";
import { Modal, ACTIONS_CLOSE, Action } from "../components/common/Modal";
import ConnectivityComponent from "../components/sections/Connectivity";
import mediumLevel from "@core/utils/lib/mediumLevel";
import MediumLevel from "@core/utils/MediumLevel";

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
        display: block;
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
  .select-box {
      padding: 15px;
      border: 1px solid black;
      border-radius: 20px;
      #title {
        text-transform: uppercase;
        font-size: 1.2rem;
      }
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

  function setTextInputValue(value) {
    setValueForm(fieldSelected.i, fieldSelected.i2, value);
    setFieldSelected(null);
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

  const { structure_ } = state;
  const { history } = props;

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
                        onSuccess={(value) => setValueForm(i, i2, value)}
                      />
                    );
                  }

                  if (element.type === "custom_proximity") {
                    return (
                      <CustomProximity
                        key={i + i2}
                        element={element}
                        onClick={(value) => setValueForm(i, i2, value)}
                      />
                    );
                  }

                  if (element.type === "custom_connectivity") {
                    return (
                      <CustomConnectivity
                        key={i + i2}
                        element={element}
                        onMount={(value) => setValueForm(i, i2, value)}
                      />
                    );
                  }

                  if (element.type === "custom_alarm") {
                    return (
                      <CustomAlarm
                        key={i + i2}
                        element={element}
                        onMount={(value) => setValueForm(i, i2, value)}
                      />
                    );
                  }

                  if (element.type === "custom_ada") {
                    return (
                      <CustomAda
                        key={i + i2}
                        element={element}
                        onPress={(value) => setValueForm(i, i2, value)}
                      />
                    );
                  }

                  if (element.type === "custom_temperature") {
                    return (
                      <CustomTemperature
                        key={i + i2}
                        element={element}
                        onClick={(value) => setValueForm(i, i2, value)}
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
                    <div key={i + i2} onClick={() => element.permission === "write" && setFieldSelected({...element, i: i, i2: i2})} className="input-box">
                      <MInput
                        className={element.permission}
                        type={element.type}
                        label={__(element.label_id)}
                        value={element.value}
                        // onChange={value => console.log(value)}
                      />
                      <span className="unit">{element.unit}</span>
                    </div>
                  );

                })
              }
            </Group>
          ))}
          <Group title="" size={74} />
          <MButton id="exit-btn" onClick={() => history.push(Pages.Menu)}>EXIT TO MASTER UI</MButton>
          <MButton disabled={testValidation(state.structure_)} id="exit-btn" onClick={() => completeTest()}>COMPLETE TEST</MButton>
        </Grid>
      </MasterContent>

      {
        fieldSelected !== null &&
        <ModalKeyboard
          title={__(fieldSelected.label_id)}
          type={ModalKeyboardTypes.Full}
          form={fieldSelected.value}
          cancel={() => setFieldSelected(null)}
          finish={value => setTextInputValue(value)}
        />
      }

    </MenuContent>
  );
};

/* ==== COMPONENTS ==== */
/* ======================================== */

const CustomQr = (props) => {
  const [modalQr, setModalQr] = React.useState<boolean>(false);
  const configContext = React.useContext(ConfigContext);

  React.useEffect(() => {
    const qrSocket = mediumLevel.config.startQrCamera()
      .pipe(
        mergeMap(() =>
          configContext.ws.multiplex(
            () => {},
            () => {},
            data => data && data.message_type === SOCKET_CONSUMER.QR_TEST
        )),
        tap(() => mediumLevel.config.stopQrCamera().subscribe())
      ).subscribe(data => {
        if (data.value === "OK") {
          qrSocket.unsubscribe();
          props.onSuccess(true);
          setModalQr(false);
        }
      });
  }, [modalQr]);

  return (
    <>
      <div className="select-box">
        <span id="title">CUSTOM QR</span>
        <MButton
          onClick={() => setModalQr(true)}
          info
          type={props.element.value ? MTypes.INFO_SUCCESS : null}
        >
          {__("Scan Qr")}
        </MButton>
      </div>
      <Modal
        show={modalQr}
        cancel={() => setModalQr(false)}
        title={__("Qr")}
        actions={[...ACTIONS_CLOSE]}
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

  const [connectivityModal, setConnectivityModal] = React.useState(false);
  const _connectivity = React.useContext(ServiceContext).connectivity;
  const wifiStatus = _connectivity.list.find(c => c.$index === "wifi").info === "success"
    ? MTypes.INFO_SUCCESS
    : null;
  const mobileStatus = _connectivity.list.find(c => c.$index === "mobile").info === "success"
    ? MTypes.INFO_SUCCESS
    : null;

  React.useEffect(() => {
    props.onMount(
      wifiStatus === MTypes.INFO_SUCCESS && mobileStatus === MTypes.INFO_SUCCESS
       ? true : false
    );
  }, []);


  return (
    <>
      <div className="select-box">
        <span id="title">CUSTOM CONNECTIVITY</span>
        <MButton info type={wifiStatus} onClick={() => setConnectivityModal(true)}>{__("Wifi")}</MButton>
        <MButton info type={mobileStatus} onClick={() => setConnectivityModal(true)}>{__("Mobile Data")}</MButton>
      </div>
      <Modal
        show={connectivityModal}
        cancel={() => setConnectivityModal(false)}
        title={__("Connectivity")}
        actions={[...actionsConnectivity, ...ACTIONS_CLOSE]}
      >
        <ConnectivityComponent handleActions={handleActionsConnectivity} />
      </Modal>
    </>
  );
};

const CustomProximity = (props) => {
  // const [distancesCheck, setDistanceCheck] = React.useState(props.element.value);
  const [distance, setDistance] = React.useState(null);

  const selectButton = (selectedIndex) => {
    props.onClick(props.element.value.map((d, i) => {
      d.value = i === selectedIndex ? !d.value : d.value;
      return d;
    }));
  };

  function pollingProximity(): Observable<any> {
    return timer(0, 1000)
    .pipe(
      concatMap(_ => mediumLevel.product.proximity()),
      map(elements => setDistance(elements.ps_value))
    );
  }

  React.useEffect(() => {
    let polling_ = pollingProximity().subscribe();
    return () => polling_.unsubscribe();
  }, []);

  return (
    <div className="select-box">
      <span id="title">CUSTOM PROXIMITY</span>
        <span>{distance}</span>
        { props.element.value.map((v, i) =>
            <MButton
              key={i}
              onClick={() => selectButton(i)}
              info
              type={v.value ? MTypes.INFO_SUCCESS : null}
            >
              {v.distance} cm
            </MButton>
          )

        }
    </div>
  );
};

const CustomTemperature = (props) => {
  const [temperatureValue, setTemperatureValue] = React.useState(null);

  function pollingTemperature(): Observable<any> {
    return timer(0, 1000)
    .pipe(
      concatMap(_ => mediumLevel.product.temperature()),
      map(elements => setTemperatureValue(elements.value))
    );
  }

  React.useEffect(() => {
    let polling_ = pollingTemperature().subscribe();
    return () => polling_.unsubscribe();
  }, []);

  return (
    <div className="select-box">
      <span id="title">CUSTOM TEMPERATURE</span>
      <span>{temperatureValue}</span>
      <MButton
        info
        onClick={() => props.onClick(!props.element.value)}
        type={props.element.value ? MTypes.INFO_SUCCESS : null}
      >
        {__("Temperature")}
      </MButton>
    </div>
  );
};

const CustomAlarm = (props) => {
  const configAlarms = React.useContext(ConfigContext).allAlarms;
  const options = props.element.alarms.map(al => {
    const currentAlarm = configAlarms.find(el => el.alarm_name === al);
    return {
      label: al,
      value: currentAlarm.alarm_state ? MTypes.INFO_DANGER : MTypes.INFO_SUCCESS
    };
  });

  React.useEffect(() => {
    props.onMount(options.find(al => al.value === MTypes.INFO_DANGER ? false : true));
  }, []);

  return (
    <div className="select-box">
      <span id="title">CUSTOM ALARM</span>
      { options.map((o, i) => <MButton key={i} info type={o.value}>{__(o.label)}</MButton> )}
    </div>
  );
};

const CustomAda = (props) => {

  const [ADAButtons, setADAButtonsState] = React.useState([
    { key: "BACK", value: false },
    { key: "LEFT", value: false },
    { key: "RIGHT", value: false },
    { key: "ENTER", value: false },
    { key: "POUR", value: false },
  ]);

  function onKeyDown(evt: KeyboardEvent) {
    const event = KeyMapping[evt.keyCode];
    if (event === undefined) {
      return;
    }
    setADAButtonsState(prev => prev.map(ada => {
      if (ada.key === event) ada.value = true; return ada; })
    );
  }

  React.useEffect(() => {
    document.addEventListener("keypress", onKeyDown);
    return () => {
      document.removeEventListener("keypress", onKeyDown);
    };
  }, []);

  React.useEffect(() => {
    !ADAButtons.find(ada => ada.value === false) && props.onPress(true);
  }, [ADAButtons]);

  return (
    <div className="select-box">
      <span id="title">CUSTOM ADA</span>
      {ADAButtons.map((ada, i) =>
        <MButton key={i} info type={ada.value ? MTypes.INFO_SUCCESS : null}>{__(ada.key)}</MButton>
      )}
    </div>
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






const testValidation = form => {
  let valid = true;
  form.forEach(group =>
    group.elements.forEach(element => {
      if (
        element.value === false
        ||
        (element.label_id === "t_proximity" && element.value.find(el => el.value === false))
      ) {
        valid = false;
      }
    })
  );
  return !valid;
};