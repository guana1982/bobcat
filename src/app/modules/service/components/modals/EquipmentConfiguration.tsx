import * as React from "react";
import { Modal, ModalContentProps, Box, ACTIONS_CLOSE, Action } from "@modules/service/components/common/Modal";
import Steps from "rc-steps";
import styled from "styled-components";
import "rc-steps/assets/index.css";
import ConnectivityComponent from "../sections/Connectivity";
import { ServiceContext, AlertContext } from "@core/containers";
import { MButton, MTypes } from "@modules/service/components/common/Button";
import { MInput, InputContent } from "../common/Input";
import { MKeyboard, KeyboardWrapper } from "../common/Keyboard";
import { __ } from "@core/utils/lib/i18n";
import { MButtonGroup } from "../common/ButtonGroup";
import { finalize, concat } from "rxjs/operators";
import { LoaderContext } from "@core/containers/loader.container";
import { forkJoin } from "rxjs";

const ACTIONS_START = (cancel, next, disableNext: boolean): Action[] => [{
  title: __("cancel"),
  event: cancel,
}, {
  title: __("next"),
  disabled: disableNext,
  event: next,
}];

const ACTIONS_CONTROL = (cancel, previous, next, disableNext: boolean): Action[] => [{
  title: __("cancel"),
  event: cancel,
}, {
  title: __("previous"),
  event: previous,
}, {
  title: __("next"),
  disabled: disableNext,
  event: next,
}];

const ACTIONS_END = (cancel, previous, finish, disableNext: boolean): Action[] => [{
  title: __("cancel"),
  event: cancel,
}, {
  title: __("previous"),
  event: previous,
}, {
  title: __("finish"),
  disabled: disableNext,
  event: finish,
}];

const IconCheck = props => (
  <svg viewBox="0 0 26 26" width={10} height={10} {...props}>
    <path
      d="M.3 14c-.2-.2-.3-.5-.3-.7s.1-.5.3-.7l1.4-1.4c.4-.4 1-.4 1.4 0l.1.1 5.5 5.9c.2.2.5.2.7 0L22.8 3.3h.1c.4-.4 1-.4 1.4 0l1.4 1.4c.4.4.4 1 0 1.4l-16 16.6c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3L.5 14.3.3 14z"
      fill="#FFF"
    />
  </svg>
);

const icons = {
  finish: <IconCheck />
};

export const ISteps = styled(Steps)`
  min-width: 400px;
  padding: 20px;
  font-size: auto;
  &.small {
    max-width: 400px;
    margin: auto;
  }
  .rc-steps-item-finish .rc-steps-item-icon,
  .rc-steps-item-process .rc-steps-item-icon {
    background-color: ${props => props.theme.dark};
    border-color: ${props => props.theme.dark};
  }
  .rc-steps-item-title:after {
    background-color: ${props => props.theme.dark} !important;
  }
  .rc-steps-item-icon {
    border-color: ${props => props.theme.dark} !important;
  }
  .rc-steps-item-title,
  .rc-steps-item-description {
    color: ${props => props.theme.dark} !important;
  }
  .rc-steps-item-description {
    font-size: 10px;
  }
  .rc-steps-item-wait .rc-steps-item-icon > .rc-steps-icon {
    color: ${props => props.theme.dark};
  }
  .rc-steps-item-finish .rc-steps-item-icon > .rc-steps-icon svg {
    margin-top: 8px !important;
  }
`;

export const ISection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 540px;
  min-width: 1100px;
  h2, h3 {
    margin: 0;
  }
  ${KeyboardWrapper} {
    margin-top: 20px;
  }
  .form-section {
    margin-top: 10px;
    max-width: 975px;
    flex-wrap: wrap;
    ${InputContent}, .empty-field {
      flex: 50%;
      margin-bottom: 8px;
    }
    .empty-field {
      flex: 50%;
      &.one-field {
        flex: 14%;
      }
    }
  }
`;

export enum SetupTypes {
  None = "none",
  Inizialization = "inizialization",
  MotherboardReplacement = "motherboard-replacement",
  EquipmentReplacement = "equipment-replacement"
}

interface EquipmentConfigurationProps extends Partial<ModalContentProps> {
  setup?: SetupTypes;
}

interface EquipmentConfigurationState {}

let initialValues = null;

export const EquipmentConfiguration = (props: EquipmentConfigurationProps) => {

  const { cancel } = props;

  const [setup, setSetup] = React.useState<SetupTypes>(props.setup || SetupTypes.None);
  const [step, setStep] = React.useState<number>(0);

  const serviceConsumer = React.useContext(ServiceContext);
  const loaderConsumer = React.useContext(LoaderContext);
  const alertConsumer = React.useContext(AlertContext);

  const { language, country, timezone, payment, operation } = serviceConsumer.allList;

  const [languageSelected, setLanguageSelected] = React.useState(language.valueSelected);
  const [countrySelected, setCountrySelected] = React.useState(country.valueSelected);
  const [timezoneSelected, setTimezoneSelected] = React.useState(timezone.valueSelected);
  const [paymentSelected, setPaymentSelected] = React.useState(payment.valueSelected);
  const [operationSelected, setOperationSelected] = React.useState(operation.valueSelected);

  //  ==== FIRST ACTIVATION ====>
  const { firstActivation, endInizialization, endReplacement, endPickUp, statusConnectivity } = serviceConsumer;

  const stepsForm = 3;
  const { form_ } = firstActivation;
  const [form, setForm] = React.useState(form_);

  React.useEffect(() => {
    if (setup === SetupTypes.Inizialization) {
      initialValues = {
        languageSelected,
        countrySelected,
        timezoneSelected,
        paymentSelected
      };
    }
  }, [setup, props.setup]);

  const finishInizialization = () => {
    endInizialization(operationSelected, form);
  };
  //  <=== FIRST ACTIVATION ====

  //  ==== REPLACEMENT ====>
  const [serialNumber, setSerialNumber] = React.useState("");
  const finishReplacement = () => {
    endReplacement(setup, serialNumber);
  };
  //  <=== REPLACEMENT ====

  //  ==== ENABLE NEXT ====>
  const [disableNext_, setDisableNext_] = React.useState<boolean>(true);

    React.useEffect(() => {
      if (setup === SetupTypes.Inizialization) {
        if (step === 0) {
          if (languageSelected !== null) {
            setDisableNext_(false);
            return;
          }
        } else if (step === 1) {
          if (countrySelected !== null) {
            setDisableNext_(false);
            return;
          }
        } else if (step === 2) {
          if (timezoneSelected !== null) {
            setDisableNext_(false);
            return;
          }
        } else if (step === 3) {
          if (paymentSelected !== null) {
            setDisableNext_(false);
            return;
          }
        } else if (step === 4) {
          if (statusConnectivity === MTypes.INFO_SUCCESS) {
            setDisableNext_(false);
            return;
          }
        } else if (step === 5) {
          if (operationSelected !== null) {
            setDisableNext_(false);
            return;
          }
        } else if (step === 6 || step === 7) {
          const stepFields_: any[] = firstActivation.structure_[step - 5].fields;
          let formValid_ = true;
          stepFields_.forEach(field => {
            if (!field.mandatory) {
              return;
            }

            if (field.type === "alphanumeric") {
              if (form[field.$index] === "") {
                formValid_ = false;
                return;
              }
            }
            else if (field.type === "email") {
              if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form[field.$index]))) {
                formValid_ = false;
                return;
              }
            }
          });
          setDisableNext_(!formValid_);
          return;
        }
      } else if (setup === SetupTypes.MotherboardReplacement || setup === SetupTypes.EquipmentReplacement) {
        if (step === 0) {
          if (statusConnectivity === MTypes.INFO_SUCCESS) {
            setDisableNext_(false);
            return;
          }
        } else if (step === 1) {
          if (serialNumber !== "") {
            setDisableNext_(false);
            return;
          }
        }
      }

      setDisableNext_(true);
    }, [setup, step, operationSelected, timezoneSelected, languageSelected, paymentSelected, countrySelected, statusConnectivity, form, serialNumber]);
    //  <=== ENABLE NEXT ====

  //  ==== ACTIONS CONNECTIVITY ====>
  const [actionsConnectivity, setActionsConnectivity] = React.useState<Action[]>([]);
  const handleActionsConnectivity = (actions): void => setActionsConnectivity(actions);
  React.useEffect(() => {
    if (!((setup === SetupTypes.Inizialization && step === 4) || ((setup === SetupTypes.MotherboardReplacement || setup === SetupTypes.EquipmentReplacement) && step === 0))) {
      setActionsConnectivity([]);
    }
  }, [setup, step]);
  //  <=== ACTIONS CONNECTIVITY ====

  React.useEffect(() => {

  }, []);

  React.useEffect(() => {
    setStep(0);

    setLanguageSelected(language.valueSelected);
    setCountrySelected(country.valueSelected);
    setTimezoneSelected(timezone.valueSelected);
    setPaymentSelected(payment.valueSelected);
    setOperationSelected(operation.valueSelected);

    setForm(form_);
    setSerialNumber("");
  }, [setup]);

  const pickUp = () => {

    const completePickUp = () => {
      setTimeout(() => {
        alertConsumer.show({
          timeout: false,
          title: "PICK UP",
          content: "PLEASE DRAIN WATER BATH AND FLUSH THE LINES AFTER SYSTEM SHUTDOWN.",
          onConfirm: endPickUp
        });
      }, 50);
    };

    alertConsumer.show({
      timeout: false,
      title: "PICK UP",
      content: "ARE YOU SURE THAT YOU WANT TO RESET THE EQUIPMENT? \n VALVE SETTINGS AND INITIAL SETUP WILL BE CLEARED.",
      onConfirm: completePickUp
    });
  };

  const actionsModal = (maxSteps: number, finish?: () => void, disableNext?: boolean) => {
    if (!finish) {
      finish = () => console.log("Pls add => Finish");
    }
    const cancel_ = () => {
      if (props.setup) {
        let cancelCall$ = null;
        if (setup === SetupTypes.Inizialization) {
          cancelCall$ = forkJoin(
            language.update(initialValues.languageSelected),
            country.update(initialValues.countrySelected),
            timezone.update(initialValues.timezoneSelected),
            payment.update(initialValues.paymentSelected)
          );
        }
        if (cancelCall$) {
          loaderConsumer.show();
          cancelCall$
          .pipe(finalize(() => loaderConsumer.hide()))
          .subscribe(() => cancel());
        } else {
          cancel();
        }
        return;
      }
      setSetup(SetupTypes.None);
    };
    const nextStep = () => {
      let stepCall$ = null;
      if (setup === SetupTypes.Inizialization) {
        if (step === 0) {
          stepCall$ = language.update(languageSelected);
        } else if (step === 1) {
          stepCall$ = country.update(countrySelected);
        } else if (step === 2) {
          stepCall$ = timezone.update(timezoneSelected);
        } else if (step === 3) {
          stepCall$ = payment.update(paymentSelected);
        }
      }
      if (stepCall$) {
        // loaderConsumer.show();
        stepCall$
        .subscribe(() => setStep(prev => prev + 1)); // .pipe(finalize(() => loaderConsumer.hide()))
      } else {
        setStep(prev => prev + 1);
      }
    };
    const prevStep = () => setStep(prev => prev - 1);
    if (step === 0) {
      return ACTIONS_START(cancel_, nextStep, disableNext);
    } else if (step === maxSteps - 1) {
      return ACTIONS_END(cancel_, prevStep, finish, disableNext);
    } else {
      return ACTIONS_CONTROL(cancel_, prevStep, nextStep, disableNext);
    }
  };

  if (setup === SetupTypes.None)
  return (
    <Modal
      show={true}
      cancel={cancel}
      title="EQUIPMENT CONFIGURATION"
      subTitle="SELECT DESIRED ACTION"
      actions={ACTIONS_CLOSE}
    >
      <Box className="centered">
        <MButton onClick={() => setSetup(SetupTypes.Inizialization)}>INITIAL SETUP</MButton>
        <MButton onClick={() => setSetup(SetupTypes.MotherboardReplacement)}>MOTHERBOARD REPLACEMENT</MButton>
        <MButton onClick={() => setSetup(SetupTypes.EquipmentReplacement)}>EQUIPMENT REPLACEMENT</MButton>
        <MButton onClick={() => pickUp()}>PICK UP</MButton>
      </Box>
    </Modal>
  );

  if (setup === SetupTypes.Inizialization)
  return (
    <Modal
      show={true}
      title="INITIAL SETUP"
      actions={[...actionsConnectivity, ...actionsModal(5 + stepsForm, finishInizialization, disableNext_)]}
    >
      <>
        <div>
          <ISteps icons={icons} current={step}>
            <ISteps.Step title="LANGUAGE" description="SELECT LANGUAGE" />
            <ISteps.Step title="COUNTRY" description="SELECT COUNTRY" />
            <ISteps.Step title="TIMEZONE" description="SELECT TIMEZONE" />
            <ISteps.Step title="PAYMENT" description="SELECT PAYMENT" />
            <ISteps.Step title="CONNECTION" description="CHECK CONNECTION" />
            <ISteps.Step title="INITIALIZATION" description="FILL FORM" />
          </ISteps>
          <Box className="container">
            <ISection>
              <>
              {step === 0 && (
                <MButtonGroup
                  options={language.list}
                  value={languageSelected}
                  onChange={(value) => setLanguageSelected(value)}
                />
              )}
              {step === 1 && (
                <MButtonGroup
                  options={country.list}
                  value={countrySelected}
                  onChange={(value) => setCountrySelected(value)}
                />
              )}
              {step === 2 && (
                <MButtonGroup
                  options={timezone.list}
                  value={timezoneSelected}
                  onChange={(value) => setTimezoneSelected(value)}
                />
              )}
              {step === 3 && (
                <MButtonGroup
                  options={payment.list}
                  value={paymentSelected}
                  onChange={(value) => setPaymentSelected(value)}
                />
              )}
              {step === 4 && (
                <ConnectivityComponent handleActions={handleActionsConnectivity} />
              )}
              {step >= 5 && (
                <FormInitialization
                  form={form}
                  setForm={setForm}
                  maxStep={stepsForm}
                  firstActivation={firstActivation}
                  indexStep={step - 5}
                  operation_={{
                    operation,
                    operationSelected,
                    setOperationSelected
                  }}
                />
              )}
              </>
            </ISection>
          </Box>
        </div>
      </>
    </Modal>
  );

  if (setup === SetupTypes.MotherboardReplacement || setup === SetupTypes.EquipmentReplacement)
  return (
    <Modal
      show={true}
      title={`${__(setup === SetupTypes.MotherboardReplacement ? "MOTHERBOARD" : "EQUIPMENT" )} REPLACEMENT`}
      actions={[...actionsConnectivity, ...actionsModal(2, finishReplacement, disableNext_)]}
    >
      <>
        <div>
          <ISteps className="small" icons={icons} current={step}>
            <ISteps.Step title="CONNECTION" description="CHECK CONNECTION" />
            <ISteps.Step title="SERIAL NUMBER" description="ENTER SERIAL" />
          </ISteps>
          <Box className="container">
            <ISection>
              <>
              {step === 0 && (
                <ConnectivityComponent handleActions={handleActionsConnectivity} />
              )}
              {step === 1 && (
                <>
                  <h2>SERIAL NUMBER</h2>
                  <h3>ENTER SERIAL NUMBER</h3>
                  <Box className="centered">
                    <MInput
                      value={serialNumber}
                      onChange={e => console.log(e)}
                    />
                  </Box>
                  <MKeyboard
                    inputName={"serial_number"}
                    onChangeAll={({ serial_number }) => setSerialNumber(serial_number)} />
                </>
              )}
              </>
            </ISection>
          </Box>
        </div>
      </>
    </Modal>
  );

};

/* ==== FORM INITIALIZATION ==== */
/* ======================================== */

interface FormInitializationProps {
  firstActivation: any;
  maxStep: number;
  indexStep: number;
  form: any;
  setForm: any;
  operation_: {
    operation: any;
    operationSelected: any;
    setOperationSelected: any;
  };
}

const FormInitialization = (props: FormInitializationProps) => {

  const { firstActivation, indexStep, maxStep, form, setForm, operation_ } = props;
  const { structure_ } = firstActivation;
  const stepActivation = structure_[indexStep];

  const fields = stepActivation ? stepActivation.fields : [];

  const keyboardEl = React.useRef(null);
  React.useEffect(() => {
    if (indexStep === 1) {
      const keyboardEl_ = keyboardEl.current;
      Object.keys(form).forEach(key => {
        keyboardEl_.setInput(form[key], key);
      });
    }
  }, [indexStep]);

  const [fieldSelected, setFieldSelected] = React.useState(null);

  const onChangeAll = inputObj => {
    delete inputObj.default;
    setForm(prevState => ({
      ...prevState,
      ...inputObj
    }));
  };

  React.useEffect(() => {
    const firstField = fields[0];
    if (!firstField) {
      return;
    }
    setFieldSelected(firstField.$index);
  }, [fields]);

  const onEnter = () => {
    fields.forEach((element, index) => {
      if (element.$index === fieldSelected) {
        const nextIndex = index + 1 < fields.length ? index + 1  : 0;
        const firstField = fields[nextIndex];
        setFieldSelected(firstField.$index);
        return;
      }
    });
  };

  return (
    <>
      <h2>INITIALIZATION DATA - {indexStep + 1}/{maxStep}</h2>
      {indexStep === 0 && (
        <>
          <br/><br/>
          <MButtonGroup
            options={operation_.operation.list}
            value={operation_.operationSelected}
            onChange={(value) => operation_.setOperationSelected(value)}
          />
        </>
      )}
      {indexStep > 0 && (
        <>
          {fields.length < 3 && <br/>}
          <Box className="form-section">
            {
              fields.map((field, index) => (
                <MInput
                  selected={field.$index === fieldSelected}
                  key={index}
                  required={field.mandatory}
                  label={__(field.$index)}
                  value={form[field.$index]}
                  type={field.type}
                  click={() => setFieldSelected(field.$index)}
                  onChange={e => console.log(e)}
                />
              ))
            }
            {fields.length % 2 !== 0 && <span className={`empty-field ${fields.length === 1 && "one-field"}`} />}
          </Box>
          <MKeyboard
            ref={keyboardEl}
            inputName={fieldSelected}
            onChangeAll={(all) => onChangeAll(all) }
            onEnter={() => onEnter()}
          />
        </>
      )}
    </>
  );
};