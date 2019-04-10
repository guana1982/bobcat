import * as React from "react";
import { Modal, ACTIONS_CONFIRM, ModalContent, ModalContentProps, Box, ACTIONS_CLOSE } from "@modules/service/components/Modal";
import Steps, { Step } from "rc-steps";
import styled from "styled-components";
import "rc-steps/assets/index.css";
import ConnectivityComponent from "../connectivity/connectivity.component";
import { ServiceContext } from "@core/containers";
import { MButton } from "@modules/service/components/Button";

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
  min-width: 1100px;
  padding: 20px;
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
  padding: 20px;
  height: 400px;
`;

interface EquipmentConfigurationProps extends Partial<ModalContentProps> {}

interface EquipmentConfigurationState {}

const EquipmentConfigurationComponent = (props: EquipmentConfigurationProps) => {

  const { cancel } = props;

  const [state, setState] = React.useState<EquipmentConfigurationState>({});

  const serviceConsumer = React.useContext(ServiceContext);

  React.useEffect(() => {

  }, []);

  return (
    <Modal
      show={true}
      cancel={cancel}
      title="EQUIPMENT CONFIGURATION"
      subTitle="SELECT DESIRED ACTION"
      actions={ACTIONS_CLOSE}
    >
      <Box className="centered">
        <MButton>INITIAL SETUP</MButton>
        <MButton>MOTHERBOARD REPLACEMENT</MButton>
        <MButton>EQUIPMENT REPLACEMENT</MButton>
        <MButton>PICK UP</MButton>
      </Box>
    </Modal>
  );

  return (
    <div>
      <ISteps icons={icons} current={2}>
        <ISteps.Step title="OPERATIONS" description="SELECT OPERATIONS" />
        <ISteps.Step title="LANGUAGE" description="SELECT LANGUAGE" />
        <ISteps.Step title="PAYMENT" description="SELECT PAYMENT" />
        <ISteps.Step title="COUNTRY" description="SELECT COUNTRY" />
        <ISteps.Step title="CONNECTION" description="CHECK STATUS CONNECTION" />
        <ISteps.Step title="EquipmentConfiguration" description="FILL EquipmentConfiguration FORM" />
      </ISteps>
      <ISection>
        <ConnectivityComponent />
      </ISection>
    </div>
  );

};

export default EquipmentConfigurationComponent;
