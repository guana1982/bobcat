import * as React from "react";
import styled from "styled-components";
import { ModalContentProps, Box, Modal, ACTIONS_CONFIRM, ACTIONS_CLOSE, ModalContent } from "@modules/service/components/common/Modal";
import { MButton, MTypes } from "@modules/service/components/common/Button";
import { ILine, ServiceContext, ILineSave, ConfigContext, AuthLevels } from "@core/containers";
import { __ } from "@core/utils/lib/i18n";
import BeverageLogo from "@core/components/common/Logo";
import { calcolaPerc, checkExpiringDate } from "@core/utils/constants";
import { MInput } from "../common/Input";
import { ModalKeyboard, ModalKeyboardTypes } from "../common/ModalKeyboard";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { Calibration } from "../sections/Calibration";

const LevelBeverage = styled.div`
  position: relative;
  width: 210px;
  height: 28px;
  display: flex;
  border-radius: 8px;
  background: ${props => props.theme.light};
  border: 2px solid ${props => props.theme.dark};
  &:before {
    content: "";
    height: 100%;
    border-radius: 5px;
    width: ${props => props.level}%;
    position: absolute;
    top: 0px;
    left: 0px;
    background: ${props => props.theme.success};
  }
`;

const LineContent = styled.div`
  &.large {
    width: 800px;
  }
  ${Box}#beverage-box {
    justify-content: center;
    align-items: center;
  }
  h3 {
    margin: 5px 0 !important;
    display: flex;
    align-items: center;
    span {
      margin-right: 10px;
    }
  }
`;

interface LineProps extends Partial<ModalContentProps> {
  lineId: number;
  authLevel: AuthLevels;
}

export const Line = (props: LineProps) => {

  const { cancel, lineId } = props;

  const [syrupSelected, setSyrupSelected] = React.useState<number>(null);

  const [bibReset, setBibReset] = React.useState<boolean>(false);
  const [priming, setPriming] = React.useState<boolean>(false);
  const [calibration, setCalibration] = React.useState<boolean>(false);
  const [lineAssignment, setLineAssignment] = React.useState<boolean>(false);

  const serviceConsumer = React.useContext(ServiceContext);

  React.useEffect(() => {

  }, []);

  const { lines, lockLine, unlockLine } = serviceConsumer;
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

    serviceConsumer.saveLines(editLine)
    .subscribe();
  }

  /* ==== WATER LINE ==== */
  /* ======================================== */

  const indexLineWater = lines.waters.indexOf(line);
  if (indexLineWater !== -1) {
    return (
      <>
      <Modal
        show={true}
        cancel={cancel}
        title={`WATER LINE #${line.line_id} - ${__($beverage.beverage_label_id)}`}
        actions={ACTIONS_CLOSE}
      >
        <LineContent>
          <div>
            <Box className="centered">
              <MButton visibled light info={`LINE - ${line.line_id}`}>
                <BeverageLogo beverage={$beverage} size="tiny" />
              </MButton>
            </Box>
            <Box className="centered">
            <MButton info type={$beverage.calibration_status ? MTypes.INFO_SUCCESS : MTypes.INFO_DANGER} onClick={() => setCalibration(true)}>CALIBRATION {$beverage.calibration_status ? $beverage.last_calibration_date : ""}</MButton>
            </Box>
          </div>
        </LineContent>
      </Modal>
      {calibration && <CalibrationModal line={line} indexLineWater={indexLineWater} unMount={() => setCalibration(false)} />}
      </>
    );
  }

  /* ==== LINE ASSIGNMENT ==== */
  /* ======================================== */

  const { syrups } = serviceConsumer;

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
                    info={syrup.beverage_id === -1 ? "-" : `ID - ${syrup.beverage_id}`}
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

  const { bib_size, remaining_bib } = $beverage;
  const percLevel = calcolaPerc(bib_size, remaining_bib);

  return (
    <>
    <Modal
      show={true}
      cancel={cancel}
      title={`FLAVOR LINE #${line.line_id} - ${__($beverage.beverage_label_id)}`}
      actions={ACTIONS_CLOSE}
    >
      <LineContent className={"large"}>
        <div>
          <Box id={"beverage-box"}>
            <MButton visibled light info={`ID: ${$beverage.beverage_id}${$beverage.$lock ? " / locked" : ""}`}>
              <BeverageLogo beverage={$beverage} size="tiny" />
            </MButton>
            <div id="info-box">
              <h3>SKU NO. {$beverage.beverage_id} - V1</h3>
              <h3><span>LEVEL:</span> <LevelBeverage level={percLevel} /></h3>
              <h3><span>VOLUME (GAL):</span> <MInput className="small" value={$beverage.bib_size / 3.78541} onChange={() => null} disabled /></h3>
              <h3><span>EXPIRATION DATE:</span> <MInput className={`small ${checkExpiringDate($beverage.bib_expiring_date) && "alert"}`} value={$beverage.bib_expiring_date} onChange={() => null} disabled /></h3>
            </div>
          </Box>
          <Box className="centered">
            {!$beverage.$lock && <MButton onClick={() => lockLine($beverage.line_id).subscribe()}>LOCK DISPENSE</MButton>}
            {$beverage.$lock && <MButton onClick={() => unlockLine($beverage.line_id).subscribe()}>UNLOCK DISPENSE</MButton>}
            {props.authLevel !== AuthLevels.Crew && <MButton onClick={() => setLineAssignment(true)}>CHANGE LINE ASSIGNMENT</MButton>}
            <MButton onClick={() => setPriming(true)}>PRIMING</MButton>
            {props.authLevel !== AuthLevels.Crew && <MButton info type={$beverage.calibration_status ? MTypes.INFO_SUCCESS : MTypes.INFO_DANGER} onClick={() => setCalibration(true)}>CALIBRATION {$beverage.calibration_status ? $beverage.last_calibration_date : ""}</MButton>}
            <MButton onClick={() => setBibReset(true)}>BIB RESET</MButton>
          </Box>
        </div>
      </LineContent>
    </Modal>
    {bibReset && <BibReset line={line} unMount={() => setBibReset(false)} />}
    {priming && <Priming line={line} unMount={() => setPriming(false)} />}
    {calibration && <CalibrationModal line={line} indexLineWater={indexLineWater} unMount={() => setCalibration(false)} />}
    </>
  );
};

const BibReset = props => {
  const serviceConsumer = React.useContext(ServiceContext);
  return (
    <ModalKeyboard
      beverage={props.line.$beverage}
      title={"BIB RESET"}
      type={ModalKeyboardTypes.Multiple}
      cancel={() => props.unMount()}
      finish={(line) => serviceConsumer.bibReset(line)}
    />
  );
};

const Priming = props => {
  const [isPriming, setIsPriming] = React.useState(false);
  const set = () => {
    setIsPriming(true);
    mediumLevel.line.startPriming(props.line.line_id).subscribe();
  };
  const unset = () => {
    setIsPriming(false);
    mediumLevel.line.stopPriming(props.line.line_id).subscribe();
    clearTimeout(timeout_);
    // props.close();
  };
  const timeout_ = isPriming && setTimeout(() => unset(), 30000);
  return (
    <Modal
      show={true}
      cancel={() => props.unMount()}
      title="PRIMING"
      actions={isPriming ? [] : ACTIONS_CLOSE}
    >
      <Box className="centered">
        {!isPriming && <MButton onClick={() => set()}>START PRIMING</MButton>}
        {isPriming && <MButton onClick={() => unset()}>STOP PRIMING</MButton>}
      </Box>
    </Modal>
  );
};

const CalibrationModal = props => {
  const { indexLineWater } = props;
  const [calibrationStatus, setCalibrationStatus] = React.useState(null);

  const configConsumer = React.useContext(ConfigContext);
  const { setBeverages } = configConsumer;

  const completeCalibration = (value: boolean) => {
    setCalibrationStatus(value);
    if (value) {
      setBeverages.subscribe();
    }
  };

  return (
    <Modal
      show={true}
      cancel={() => props.unMount()}
      title="CALIBRATION"
      actions={ACTIONS_CLOSE}
    >
      <Box className="centered">
        <Calibration
          line={props.line}
          waters={indexLineWater !== -1}
          lineStatus={calibrationStatus}
          onEnd={value => completeCalibration(value)}
        />
      </Box>
    </Modal>
  );
};