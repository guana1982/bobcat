import * as React from "react";
import styled, { keyframes } from "styled-components";
import Circle from "react-circle";
import { ModalContentProps, Box, Modal, ACTIONS_CONFIRM, ACTIONS_CLOSE } from "@modules/service/components/Modal";
import { MButton } from "@modules/service/components/Button";
import { __ } from "@core/utils/lib/i18n";
import BeverageLogo from "@core/components/common/Logo";
import { ServiceContext } from "@core/containers";

const ChangePriceContent = styled.div`

`;

interface ChangePriceProps extends Partial<ModalContentProps> {
  closeAllModal: any;
}

const ChangePriceComponent = (props: ChangePriceProps) => {

  const { closeAllModal } = props;

  const serviceConsumer = React.useContext(ServiceContext);

  React.useEffect(() => {

  }, []);

  const { lines } = serviceConsumer;

  return (
    <Modal
      show={true}
      cancel={closeAllModal}
      title={"CHANGE PRICE"}
      subTitle={"SELECT FLAVOR FOR DESIRED PRICE CHANGE"}
      content={
        <ChangePriceContent>
          <Box className="container">
            <h3 id="title">flavor</h3>
            <Box className="elements">
              {lines.pumps.map((line, i) => {
                if (!line.$beverage) return null;
                return (
                  <MButton key={i} className="small" light info={`Line - ${line.line_id}`}>
                    <BeverageLogo beverage={line.$beverage} size="tiny" />
                  </MButton>
                );
              })}
            </Box>
            <h3 id="title">waters</h3>
            <Box className="elements">
              {lines.waters.map((line, i) => {
                                if (!line.$beverage) return null;
                return (
                  <MButton key={i} className="small" light info={`${line.$beverage.beverage_type} - ${line.line_id}`}>
                    <BeverageLogo beverage={line.$beverage} size="tiny" />
                  </MButton>
                );
              })}
            </Box>
          </Box>
        </ChangePriceContent>
      }
      actions={ACTIONS_CLOSE}
    ></Modal>
  );
};

export default ChangePriceComponent;
