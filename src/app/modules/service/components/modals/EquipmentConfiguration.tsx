import * as React from "react";
import { Modal, ModalContentProps, Box, ACTIONS_CLOSE, Action } from "@modules/service/components/common/Modal";
import Steps from "rc-steps";
import styled from "styled-components";
import "rc-steps/assets/index.css";
import ConnectivityComponent from "../sections/Connectivity";
import { ServiceContext } from "@core/containers";
import { MButton } from "@modules/service/components/common/Button";
import { MInput, InputContent } from "../common/Input";
import { MKeyboard, KeyboardWrapper } from "../common/Keyboard";
import { __ } from "@core/utils/lib/i18n";
import { MButtonGroup } from "../common/ButtonGroup";

const ACTIONS_START = (cancel, next): Action[] => [{
  title: __("cancel"),
  event: cancel,
}, {
  title: __("next"),
  event: next,
}];

const ACTIONS_CONTROL = (cancel, previous, next): Action[] => [{
  title: __("cancel"),
  event: cancel,
}, {
  title: __("previous"),
  event: previous,
}, {
  title: __("next"),
  event: next,
}];

const ACTIONS_END = (cancel, previous, finish): Action[] => [{
  title: __("cancel"),
  event: cancel,
}, {
  title: __("previous"),
  event: previous,
}, {
  title: __("finish"),
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
  height: 515px;
  min-width: 1100px;
  h2, h3 {
    margin: 0;
  }
  ${KeyboardWrapper} {
    margin-top: 20px;
  }
  .form-section {
    margin-top: 10px;
    .form-group {
      width: 470px;
      ${InputContent} {
        margin-bottom: 8px;
      }
    }
  }
`;

enum SetupTypes {
  None = "none",
  Inizialization = "inizialization",
  MotherboardReplacement = "motherboard-replacement",
  EquipmentReplacement = "equipment-replacement"
}

interface EquipmentConfigurationProps extends Partial<ModalContentProps> {}

interface EquipmentConfigurationState {}

export const EquipmentConfiguration = (props: EquipmentConfigurationProps) => {

  const { cancel } = props;

  const [setup, setSetup] = React.useState<SetupTypes>(SetupTypes.None);
  const [step, setStep] = React.useState<number>(0);
  const [state, setState] = React.useState<EquipmentConfigurationState>({});

  const serviceConsumer = React.useContext(ServiceContext);

  const { operation, language, payment, country } = serviceConsumer.allList;
  const [operationSelected, setOperationSelected] = React.useState(null);
  const [languageSelected, setLanguageSelected] = React.useState(null);
  const [paymentSelected, setPaymentSelected] = React.useState(null);
  const [countrySelected, setCountrySelected] = React.useState(null);

  React.useEffect(() => {

  }, []);

  React.useEffect(() => {
    setStep(0);
  }, [setup]);

  const pickUp = () => {
    alert("Pick Up");
  };

  const actionsModal = (maxSteps: number, finish?: () => void) => {
    if (!finish) {
      finish = () => alert("finish");
    }
    const cancel_ = () => setSetup(SetupTypes.None);
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    if (step === 0) {
      return ACTIONS_START(cancel_, nextStep);
    } else if (step === maxSteps - 1) {
      return ACTIONS_END(cancel_, prevStep, finish);
    } else {
      return ACTIONS_CONTROL(cancel_, prevStep, nextStep);
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
      cancel={() => setSetup(SetupTypes.None)}
      title="EQUIPMENT CONFIGURATION"
      subTitle="SELECT DESIRED ACTION"
      actions={actionsModal(6)}
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
                <ConnectivityComponent />
              )}
              {step === 5 && (
                <>
                  <h2>CUSTOMER - 2/3</h2>
                  <Box className="form-section">
                    <div className="form-group">
                      <MInput
                        label={"Country"}
                        value={"---"}
                        type=""
                        onChange={e => console.log(e)}
                      />
                      <MInput
                        label={"Customer Name"}
                        value={"---"}
                        type=""
                        onChange={e => console.log(e)}
                      />
                      <MInput
                        label={"City"}
                        value={"---"}
                        type=""
                        onChange={e => console.log(e)}
                      />
                      <MInput
                        label={"Postal Code"}
                        value={"---"}
                        type=""
                        onChange={e => console.log(e)}
                      />
                    </div>
                    <div className="form-group">
                      <MInput
                        label={"Customer number (COF)"}
                        value={"---"}
                        type=""
                        onChange={e => console.log(e)}
                      />
                      <MInput
                        label={"Street Address"}
                        value={"---"}
                        type=""
                        onChange={e => console.log(e)}
                      />
                      <MInput
                        label={"State/Prov"}
                        value={"---"}
                        type=""
                        onChange={e => console.log(e)}
                      />
                    </div>
                  </Box>
                  <MKeyboard onChange={(input) => console.log("input", input)} />
                </>
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
      cancel={() => setSetup(SetupTypes.None)}
      title="EQUIPMENT CONFIGURATION"
      subTitle="SELECT DESIRED ACTION"
      actions={actionsModal(2)}
    >
      <>
        <div>
          <ISteps className="small" icons={icons} current={step}>
            <ISteps.Step title="CONNECTION" description="CHECK CONNECTION" />
            <ISteps.Step title="SERIAL NUMBER" description="ENTER SERIAL NUMBER" />
          </ISteps>
          <Box className="container">
            <ISection>
              <>
              {step === 0 && (
                <ConnectivityComponent />
              )}
              {step === 1 && (
                <>
                  <h2>SERIAL NUMBER</h2>
                  <h3>ENTER SERIAL NUMBER</h3>
                  <Box className="centered">
                    <MInput
                      value={"---"}
                      type=""
                      onChange={e => console.log(e)}
                    />
                  </Box>
                  <MKeyboard onChange={(input) => console.log("input", input)} />
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