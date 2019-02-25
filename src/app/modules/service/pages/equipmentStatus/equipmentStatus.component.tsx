import * as React from "react";
import styled, { keyframes } from "styled-components";
import { Box } from "@modules/service/components/Modal";
import { MButton, MTypes } from "@modules/service/components/Button";

const EquipmentStatusContent = styled.div`

`;

interface EquipmentStatusProps {}

interface EquipmentStatusState {}

const EquipmentStatusComponent = (props: EquipmentStatusProps) => {

  const [state, setState] = React.useState<EquipmentStatusState>({});

  React.useEffect(() => {
    console.log("open");
    return () => {
      console.log("close");
    };
  }, []);

  return (
    <div>
      <Box className="elements centered">
        <MButton type={MTypes.INFO_SUCCESS} className="small" light info>---</MButton>
        <MButton type={MTypes.INFO_SUCCESS} className="small" light info>---</MButton>
        <MButton type={MTypes.INFO_DANGER} className="small" light info>---</MButton>
        <MButton type={MTypes.INFO_DANGER} className="small" light info>---</MButton>
        <MButton type={MTypes.INFO_WARNING} className="small" light info>---</MButton>
        <MButton type={MTypes.INFO_SUCCESS} className="small" light info>---</MButton>
        <MButton type={MTypes.INFO_SUCCESS} className="small" light info>---</MButton>
        <MButton type={MTypes.INFO_SUCCESS} className="small" light info>---</MButton>
        <MButton type={MTypes.INFO_SUCCESS} className="small" light info>---</MButton>
        <MButton type={MTypes.INFO_DANGER} className="small" light info>---</MButton>
        <MButton type={MTypes.INFO_DANGER} className="small" light info>---</MButton>
        <MButton type={MTypes.INFO_SUCCESS} className="small" light info>---</MButton>
        <MButton type={MTypes.INFO_SUCCESS} className="small" light info>---</MButton>
        <MButton type={MTypes.INFO_SUCCESS} className="small" light info>---</MButton>
      </Box>
      <Box className="container">
        <h2 id="title">info</h2>
        <h4>
          --------------
          --------------
          --------------
          --------------
        </h4>
      </Box>
    </div>
  );
};

export default EquipmentStatusComponent;
