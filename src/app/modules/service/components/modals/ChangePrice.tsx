import * as React from "react";
import styled from "styled-components";
import { ModalContentProps, Box, Modal, ACTIONS_CLOSE, ACTIONS_CONFIRM } from "@modules/service/components/common/Modal";
import { MButton } from "@modules/service/components/common/Button";
import { __ } from "@core/utils/lib/i18n";
import BeverageLogo from "@core/components/common/Logo";
import { ServiceContext, ConfigContext } from "@core/containers";
import { ModalKeyboard, ModalKeyboardTypes } from "../common/ModalKeyboard";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { parsePriceBeverage, Beverages } from "@core/utils/constants";

const ChangePriceContent = styled.div`
  & > ${Box} {
    overflow: auto;
    max-height: 600px;
  }
`;

const FlexBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const KeyboardModalWrap = styled.div`
  `;

interface ChangePriceProps extends Partial<ModalContentProps> {

}

export const ChangePrice = (props: ChangePriceProps) => {

  const { cancel } = props;

  const [beverage, setBeverage] = React.useState(null);
  const { lines } = React.useContext(ServiceContext);
  const { vendorConfig, setBeverages, allBeverages } = React.useContext(ConfigContext);

  const updatePrice = (v: string) => {
    const { payment } = mediumLevel;
    payment.setPrice(String(beverage.beverage_id), v, vendorConfig.currency)
    .subscribe(
      () => setBeverages.subscribe()
    );
  };

  return (
    <>
      <Modal
        show={true}
        cancel={cancel}
        title={"CHANGE PRICE"}
        subTitle={"SELECT FLAVOR FOR DESIRED PRICE CHANGE"}
        actions={ACTIONS_CLOSE}
      >
        <ChangePriceContent>
          <Box className="container">
            <h3 id="title">waters</h3>
            <Box className="elements">
              {lines.waters.map((line, i) => {
                if (!line.$beverage) return null;
                return (
                  <FlexBox key={i}>
                    <MButton
                      className="small"
                      light
                      info={`${line.$beverage.beverage_type}`}
                      onClick={() => setBeverage(line.$beverage)}
                    >
                      <BeverageLogo beverage={line.$beverage} size="tiny" />
                    </MButton>
                    <b>{parsePriceBeverage(line.$beverage.$price, vendorConfig.currency)}</b>
                  </FlexBox>
                );
              })}
            </Box>
            <h3 id="title">flavor</h3>
            <Box className="elements">
              {allBeverages.map((beverage, i) => {
                if (beverage.beverage_type === Beverages.Bev)
                return (
                  <FlexBox key={i}>
                    <MButton
                      className="small"
                      light
                      info={`Id - ${beverage.beverage_id}`}
                      onClick={() => setBeverage(beverage)}
                    >
                      <BeverageLogo beverage={beverage} size="tiny" />
                    </MButton>
                    <b>{parsePriceBeverage(beverage.$price, vendorConfig.currency)}</b>
                  </FlexBox>
                );
              })}
            </Box>
          </Box>
        </ChangePriceContent>
      </Modal>
      {beverage !== null &&
        <ModalKeyboard
          title="CHANGE PRICE"
          type={ModalKeyboardTypes.Number}
          cancel={() => setBeverage(null)}
          finish={(v) => updatePrice(v)}
          form={[beverage.$price]}
        />
      }
    </>
  );
};