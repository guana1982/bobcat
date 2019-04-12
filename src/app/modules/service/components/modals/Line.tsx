import * as React from "react";
import styled from "styled-components";
import { ModalContentProps, Box, Modal, ACTIONS_CONFIRM, ACTIONS_CLOSE } from "@modules/service/components/common/Modal";
import { MButton, MTypes } from "@modules/service/components/common/Button";
import { ILine, ServiceContext, ILineSave } from "@core/containers";
import { __ } from "@core/utils/lib/i18n";
import BeverageLogo from "@core/components/common/Logo";
import { MButtonGroup } from "../common/ButtonGroup";
import mediumLevel from "@core/utils/lib/mediumLevel";

const LineContent = styled.div`

`;

interface LineProps extends Partial<ModalContentProps> {
  lineId: number;
}

export const Line = (props: LineProps) => {

  const { cancel, lineId } = props;

  const [syrupSelected, setSyrupSelected] = React.useState<number>(null);

  const serviceConsumer = React.useContext(ServiceContext);

  React.useEffect(() => {

  }, []);

  const { lines } = serviceConsumer;
  const line = [...lines.pumps, ...lines.waters].filter(line => line.line_id === lineId)[0];

  const { $beverage } = line;

  function saveLine() {
    if (syrupSelected === null || syrupSelected === undefined)
      return;

    const editLine: ILineSave = {
      line_id: line.line_id,
      beverage_id: syrupSelected,
      beverage_menu_index: -1
    };

    serviceConsumer.saveLines(editLine);
  }

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

  const [lineAssignment, setLineAssignment] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (lineAssignment === false) {
      setSyrupSelected(null);
    }
  }, [lineAssignment]);

  if (!$beverage || lineAssignment) {

    const cancelLineAssignment = () => {
      const disableCancel = syrupSelected !== -1 && lineAssignment;

      if (lineAssignment)
        setLineAssignment(false);

      if (!disableCancel)
        cancel();
    };

    return (
      <Modal
        show={true}
        cancel={cancelLineAssignment}
        finish={() => saveLine()}
        title={"FLAVOR LINE ASSIGNMENT"}
        subTitle={"SELECT FLAVOR TYPE (SYRUP) FOR DESIRED ASSIGNMENT"}
        actions={ACTIONS_CONFIRM}
      >
        <LineContent>
          <Box className="elements">
            <MButton className="small" light info={`Line - ${line.line_id}`}>
              {!$beverage ?
                "UNASSIGNED" :
                <BeverageLogo beverage={$beverage} size="tiny" />
              }
            </MButton>
          </Box>
          <Box className="container">
            <h3 id="title">syrups</h3>
            <Box>
              {syrups.map((syrup, i) => {
                if (!$beverage && syrup.beverage_id === -1) // REMOVE UNASSIGNED (CASE FIRST ASSIGNMENT)
                  return;

                return (
                  <MButton
                    className="small"
                    key={i}
                    visibled light
                    info={syrup.beverage_id === -1 ? "-" : syrup.beverage_id}
                    type={syrupSelected === syrup.beverage_id ? MTypes.INFO_SUCCESS : null}
                    onClick={() => setSyrupSelected(syrup.beverage_id)}
                  >
                    {syrup.beverage_id === -1 ?
                      "UNASSIGNED" :
                      <BeverageLogo beverage={syrup} size="tiny" />
                    }
                  </MButton>
                );
              })}
            </Box>
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
            <MButton onClick={() => setLineAssignment(true)} className="small">CHANGE LINE ASSIGNMENT</MButton>
            <MButton className="small">CALIBRATION</MButton>
            <MButton className="small">PRIMING</MButton>
            <MButton className="small">BIB RESET</MButton>
          </Box>
        </div>
      </LineContent>
    </Modal>
  );
};