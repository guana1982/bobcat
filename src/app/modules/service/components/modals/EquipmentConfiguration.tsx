import * as React from "react";
import { Modal, ModalContentProps, Box, ACTIONS_CLOSE } from "@modules/service/components/common/Modal";
import Steps from "rc-steps";
import styled from "styled-components";
import "rc-steps/assets/index.css";
import ConnectivityComponent from "../sections/Connectivity";
import { ServiceContext } from "@core/containers";
import { MButton } from "@modules/service/components/common/Button";
import { MInput, InputContent } from "../common/Input";
import { MKeyboard } from "../common/Keyboard";

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

export const ISection = styled(Steps)`
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: 550px;
  min-width: 1100px;
  .form-section {
    .form-group {
      width: 470px;
      ${InputContent} {
        display: flex;
        justify-content: flex-end;
        align-items: center;
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
  const [state, setState] = React.useState<EquipmentConfigurationState>({});

  const serviceConsumer = React.useContext(ServiceContext);

  React.useEffect(() => {

  }, []);

  const PickUp = () => {
    alert("Pick Up");
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
        <MButton onClick={() => PickUp()}>PICK UP</MButton>
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
      actions={ACTIONS_CLOSE}
    >
      <>
        <div>
          <ISteps icons={icons} current={2}>
            <ISteps.Step title="OPERATIONS" description="SELECT OPERATIONS" />
            <ISteps.Step title="LANGUAGE" description="SELECT LANGUAGE" />
            <ISteps.Step title="PAYMENT" description="SELECT PAYMENT" />
            <ISteps.Step title="COUNTRY" description="SELECT COUNTRY" />
            <ISteps.Step title="CONNECTION" description="CHECK CONNECTION" />
            <ISteps.Step title="INITIALIZATION" description="FILL FORM" />
          </ISteps>
          <ISection>
            {/* <ConnectivityComponent /> */}
            <h2>CUSTOMER - 2/3</h2>
            <Box className="form-section">
              <div className="form-group">
                <MInput
                  label={"Country"}
                  value={"ciao1"}
                  type=""
                  onChange={e => console.log(e)}
                />
                <MInput
                  label={"Customer Name"}
                  value={"ciao2"}
                  type=""
                  onChange={e => console.log(e)}
                />
                <MInput
                  label={"City"}
                  value={"ciao3"}
                  type=""
                  onChange={e => console.log(e)}
                />
                <MInput
                  label={"Postal Code"}
                  value={"ciao3"}
                  type=""
                  onChange={e => console.log(e)}
                />
              </div>
              <div className="form-group">
                <MInput
                  label={"Customer number (COF)"}
                  value={"ciao3"}
                  type=""
                  onChange={e => console.log(e)}
                />
                <MInput
                  label={"Street Address"}
                  value={"ciao3"}
                  type=""
                  onChange={e => console.log(e)}
                />
                <MInput
                  label={"State/Prov"}
                  value={"ciao3"}
                  type=""
                  onChange={e => console.log(e)}
                />
              </div>
            </Box>
            <MKeyboard onChange={(input) => console.log("input", input)} />
          </ISection>
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
      actions={ACTIONS_CLOSE}
    >
      <>
        <div>
          <ISteps icons={icons} current={2}>
            <ISteps.Step title="OPERATIONS" description="SELECT OPERATIONS" />
            <ISteps.Step title="LANGUAGE" description="SELECT LANGUAGE" />
          </ISteps>
          <ISection>
            <ConnectivityComponent />
          </ISection>
        </div>
      </>
    </Modal>
  );

};