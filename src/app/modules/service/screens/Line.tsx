import * as React from "react";
import styled from "styled-components";
import { ModalContentProps, Box, Modal, ACTIONS_CONFIRM, ACTIONS_CLOSE } from "@modules/service/components/Modal";
import { MButton } from "@modules/service/components/Button";
import { ILine, ServiceContext } from "@core/containers";
import { __ } from "@core/utils/lib/i18n";
import BeverageLogo from "@core/components/common/Logo";

const LineContent = styled.div`

`;

interface LineProps extends Partial<ModalContentProps> {
  line: ILine;
}

export const Line = (props: LineProps) => {

  const { cancel, line } = props;

  const serviceConsumer = React.useContext(ServiceContext);

  React.useEffect(() => {

  }, []);

  const { $beverage } = line;


  const { lines } = serviceConsumer;

  /* ==== WATER LINE ==== */
  /* ======================================== */

  const indexLineWater = lines.waters.indexOf(line);
  if (indexLineWater !== -1) {
    return (
      <Modal
        show={true}
        cancel={cancel}
        title={`WATER LINE #${line.line_id} - ${__($beverage.beverage_label_id)}`}
        actions={ACTIONS_CLOSE}
      >
        <LineContent>
          <div>
            <Box className="centered">
              <MButton className="small" disabled visibled light info={`LINE - ${line.line_id}`}>
                <BeverageLogo beverage={$beverage} size="tiny" />
              </MButton>
            </Box>
            <Box className="centered">
              <MButton>CALIBRATION</MButton>
            </Box>
          </div>
        </LineContent>
      </Modal>
    );
  }

  /* ==== LINE ASSIGNMENT ==== */
  /* ======================================== */

  const { syrups } = serviceConsumer;

  if (!$beverage) {
    return (
      <Modal
        show={true}
        cancel={cancel}
        title={"FLAVOR LINE ASSIGNMENT"}
        subTitle={"SELECT FLAVOR TYPE (SYRUP) FOR DESIRED ASSIGNMENT"}
        actions={ACTIONS_CONFIRM}
      >
        <LineContent>
          <Box className="elements">
            <MButton className="small" light info={`Line - ${line.line_id}`}>
              UNASSIGNED
            </MButton>
          </Box>
          <Box className="container">
            <h3 id="title">syrups</h3>
            {syrups.map((syrup, i) => {
              return (
                <MButton className="small" key={i} disabled visibled light info={syrup.beverage_id}>
                  <BeverageLogo beverage={syrup} size="tiny" />
                </MButton>
              );
            })}
          </Box>
        </LineContent>
      </Modal>
    );
  }

  /* ==== FLAVOR LINE ==== */
  /* ======================================== */

  return (
    <Modal
      show={true}
      cancel={cancel}
      title={`FLAVOR LINE #${line.line_id} - ${__($beverage.beverage_label_id)}`}
      actions={ACTIONS_CLOSE}
    >
      <LineContent>
        <div>
          <Box>
            <MButton disabled visibled light info={`LINE - ${line.line_id}`}>
              <BeverageLogo beverage={$beverage} size="tiny" />
            </MButton>
            <div id="info-box">
              <h3>SKU NO. {$beverage.beverage_id} - V1</h3>
            </div>
          </Box>
          <Box className="centered">
            <MButton className="small">LOCK DISPENSE</MButton>
            <MButton className="small">CHANGE LINE ASSIGNMENT</MButton>
            <MButton className="small">CALIBRATION</MButton>
            <MButton className="small">PRIMING</MButton>
            <MButton className="small">BIB RESET</MButton>
          </Box>
        </div>
      </LineContent>
    </Modal>
  );
};