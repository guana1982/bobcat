import * as React from "react";
import styled from "styled-components";
import { ModalContentProps, Box, Modal, ACTIONS_CLOSE, ACTIONS_CONFIRM } from "@modules/service/components/common/Modal";
import { MButton } from "@modules/service/components/common/Button";
import { __ } from "@core/utils/lib/i18n";
import BeverageLogo from "@core/components/common/Logo";
import { ServiceContext, ConfigContext } from "@core/containers";
import { ModalKeyboard, ModalKeyboardTypes } from "../common/ModalKeyboard";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { parsePriceBeverage } from "@core/utils/constants";

const ChangePriceContent = styled.div`

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
  const serviceConsumer = React.useContext(ServiceContext);
  const { vendorConfig, setBeverages } = React.useContext(ConfigContext);

  React.useEffect(() => {
  }, []);

  const { lines } = serviceConsumer;

  const updatePrice = (v: string) => {
    mediumLevel.payment.setPrice(beverage.beverage_id, v, vendorConfig.currency).subscribe(
      () => {},
      () => {},
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
            <h3 id="title">flavor</h3>
            <Box className="elements">
              {lines.pumps.map((line, i) => {
                if (!line.$beverage) return null;
                return (
                  <FlexBox key={i}>
                    <MButton
                      className="small"
                      light
                      info={`Line - ${line.line_id}`}
                      onClick={() => setBeverage(line.$beverage)}
                    >
                      <BeverageLogo beverage={line.$beverage} size="tiny" />
                    </MButton>
                    <span>{parsePriceBeverage(line.$beverage.$price, vendorConfig.currency)}</span>
                  </FlexBox>
                );
              })}
            </Box>
            <h3 id="title">waters</h3>
            <Box className="elements">
              {lines.waters.map((line, i) => {
                if (!line.$beverage) return null;
                return (
                  <FlexBox key={i}>
                    <MButton
                      className="small"
                      light
                      info={`${line.$beverage.beverage_type} - ${line.line_id}`}
                      onClick={() => setBeverage(line.$beverage)}
                    >
                      <BeverageLogo beverage={line.$beverage} size="tiny" />
                    </MButton>
                    <span>{parsePriceBeverage(line.$beverage.$price, vendorConfig.currency)}</span>
                  </FlexBox>
                );
              })}
            </Box>
          </Box>
        </ChangePriceContent>
      </Modal>
      {beverage !== null &&
        // <Modal
        //   show={true}
        //   title="CHANGE PRICE"
        //   actions={ACTIONS_CLOSE}
        //   cancel={() => setModal(false)}
        // >
        //   <FlexBox>
        //     <MInput value={price}/>
        //     <MKeyboard inputName="field" onChangeAll={(v) => {
          //       console.log(v);
          //       setPrice(String(v.field));
          //     }}/>
          //   </FlexBox>
          // </Modal>
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