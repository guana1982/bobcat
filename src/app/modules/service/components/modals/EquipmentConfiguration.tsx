import * as React from "react";
import { Modal, ModalContentProps, Box, ACTIONS_CLOSE, Action } from "@modules/service/components/common/Modal";
import Steps from "rc-steps";
import styled from "styled-components";
import "rc-steps/assets/index.css";
import ConnectivityComponent from "../sections/Connectivity";
import { ServiceContext } from "@core/containers";
import { MButton, MTypes } from "@modules/service/components/common/Button";
import { MInput, InputContent } from "../common/Input";
import { MKeyboard, KeyboardWrapper } from "../common/Keyboard";
import { __ } from "@core/utils/lib/i18n";
import { MButtonGroup } from "../common/ButtonGroup";

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
    ${InputContent} {
      flex: 50%;
      margin-bottom: 8px;
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

export const EquipmentConfiguration = (props: EquipmentConfigurationProps) => {

  const { cancel } = props;

  const [setup, setSetup] = React.useState<SetupTypes>(props.setup || SetupTypes.None);
  const [step, setStep] = React.useState<number>(0);
  // const [state, setState] = React.useState<EquipmentConfigurationState>({});

  const serviceConsumer = React.useContext(ServiceContext);

  //  ==== FIRST ACTIVATION ====>
  const { firstActivation, endInizialization, endReplacement, statusConnectivity } = serviceConsumer;
  const maxStepForm = firstActivation.structure_.length;
  const { form_ } = firstActivation;
  const [form, setForm] = React.useState(form_);

  React.useEffect(() => { // => CLEAN FORM ON BACK
    if (step === 4)
      setForm(form_);
  }, [step]);

  const finishInizialization = () => {
    endInizialization(form);
  };
  //  <=== FIRST ACTIVATION ====

  //  ==== REPLACEMENT ====>
  const [serialNumber, setSerialNumber] = React.useState("");
  const finishReplacement = () => {
    endReplacement(setup, serialNumber);
  };
  //  <=== REPLACEMENT ====

  const { operation, language, payment, country } = serviceConsumer.allList;

  const [operationSelected, setOperationSelected] = React.useState(null);
  const [languageSelected, setLanguageSelected] = React.useState(null);
  const [paymentSelected, setPaymentSelected] = React.useState(null);
  const [countrySelected, setCountrySelected] = React.useState(null);

  //  ==== ENABLE NEXT ====>
  const [disableNext_, setDisableNext_] = React.useState<boolean>(true);

    React.useEffect(() => {
      console.log("step_____", step);
      if (setup === SetupTypes.Inizialization) {
        if (step === 0) {
          if (operationSelected !== null) {
            setDisableNext_(false);
            return;
          }
        } else if (step === 1) {
          if (languageSelected !== null) {
            setDisableNext_(false);
            return;
          }
        } else if (step === 2) {
          if (paymentSelected !== null) {
            setDisableNext_(false);
            return;
          }
        } else if (step === 3) {
          if (countrySelected !== null) {
            setDisableNext_(false);
            return;
          }
        } else if (step === 4) {
          if (statusConnectivity === MTypes.INFO_SUCCESS) {
            setDisableNext_(false);
            return;
          }
        } else if (step === 5 || step === 6 || step === 7) {
          const stepFields_: any[] = firstActivation.structure_[step - 5].fields;
          let formValid_ = true;
          stepFields_.forEach(field => {
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
        }
      }

      setDisableNext_(true);
    }, [setup, step, operationSelected, languageSelected, paymentSelected, countrySelected, statusConnectivity, form]);

    //  <=== ENABLE NEXT ====

  //  ==== ACTIONS CONNECTIVITY ====>
  const [actionsConnectivity, setActionsConnectivity] = React.useState<Action[]>([]);
  const handleActionsConnectivity = (actions): void => setActionsConnectivity(actions);
  //  <=== ACTIONS CONNECTIVITY ====

  React.useEffect(() => {

  }, []);

  React.useEffect(() => {
    setStep(0);
  }, [setup]);

  const pickUp = () => {
    alert("Pick Up");
  };

  const actionsModal = (maxSteps: number, finish?: () => void, disableNext?: boolean) => {
    if (!finish) {
      finish = () => console.log("Pls add => Finish");
    }
    const cancel_ = () => {
      if (props.setup) {
        cancel();
        return;
      }
      setSetup(SetupTypes.None);
    };
    const nextStep = () => setStep(prev => prev + 1);
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
      actions={[...actionsConnectivity, ...actionsModal(5 + maxStepForm, finishInizialization, disableNext_)]}
    >
      <>
        <div>
          <ISteps icons={icons} current={step}>
            <ISteps.Step title="OPERATIONS" description="SELECT OPERATIONS" />
            <ISteps.Step title="LANGUAGE" description="SELECT LANGUAGE" />
            <ISteps.Step title="PAYMENT" description="SELECT PAYMENT" />
            <ISteps.Step title="COUNTRY" description="SELECT COUNTRY" />
            <ISteps.Step title="CONNECTION" description="CHECK CONNECTION" />
            <ISteps.Step title="INITIALIZATION" description="FILL FORM" />
          </ISteps>
          <Box className="container">
            <ISection>
              <>
              {step === 0 && (
                // <OperationSelection />
                <MButtonGroup
                  options={operation.list}
                  value={operationSelected}
                  onChange={(value) => setOperationSelected(value)}
                />
              )}
              {step === 1 && (
                // <LanguageSelection />
                <MButtonGroup
                  options={language.list}
                  value={languageSelected}
                  onChange={(value) => setLanguageSelected(value)}
                />
              )}
              {step === 2 && (
                // <PaymentSelection />
                <MButtonGroup
                  options={payment.list}
                  value={paymentSelected}
                  onChange={(value) => setPaymentSelected(value)}
                />
              )}
              {step === 3 && (
                // <CountrySelection />
                <MButtonGroup
                  options={country.list}
                  value={countrySelected}
                  onChange={(value) => setCountrySelected(value)}
                />
              )}
              {step === 4 && (
                <ConnectivityComponent handleActions={handleActionsConnectivity} />
              )}
              {step >= 5 && (
                <FormInitialization
                  form={form}
                  setForm={setForm}
                  maxStep={maxStepForm}
                  firstActivation={firstActivation}
                  indexStep={step - 5}
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
      actions={[...actionsConnectivity, ...actionsModal(2, finishReplacement)]}
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
}

const FormInitialization = (props: FormInitializationProps) => {

  const { firstActivation, indexStep, maxStep, form, setForm } = props;
  const { structure_ } = firstActivation;
  const stepActivation = structure_[indexStep];
  const { title, fields } = stepActivation;

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
      <h2>{title} - {indexStep + 1}/{maxStep}</h2>
      <Box className="form-section">
        {
          fields.map((field, index) => (
            <MInput
              selected={field.$index === fieldSelected}
              key={index}
              label={__(field.$index)}
              value={form[field.$index]}
              type={field.type}
              click={() => setFieldSelected(field.$index)}
              onChange={e => console.log(e)}
            />
          ))
        }
      </Box>
      <MKeyboard
        inputName={fieldSelected}
        onChangeAll={(all) => onChangeAll(all) }
        onEnter={() => onEnter()}
      />
    </>
  );
};