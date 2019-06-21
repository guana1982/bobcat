import * as React from "react";
import styled from "styled-components";
import { MButton } from "../common/Button";
import BeverageLogo from "@core/components/common/Logo";
import { MInput } from "../common/Input";
import { __ } from "@core/utils/lib/i18n";
import { ModalKeyboard, ModalKeyboardTypes } from "../common/ModalKeyboard";

const StyledCalibration = styled.div`
  .select-box {
    display: flex;
    align-items: center;
  }
  .select-box > * { display: inline-block; }
  & > div input {
    width: 150px;
    margin: 5px 20px;
  }
`;

export const Calibration = props => {
  const { line } = props;
  const [lineState, setLineState] = React.useState({
    ratio: null,
    timer: null,
    tick: null,
    volume: null
  });
  const [timerState, setTimerState] = React.useState(null);
  const [fieldSelected, setFieldSelected] = React.useState();

  return (
    <>
      <StyledCalibration>
        <div className="select-box">
          <MButton
            type={null}
            className="small"
            light
            info={`Line - ${line.line_id}`}>
              {line.$beverage ? <BeverageLogo beverage={line.$beverage} size="tiny" /> : "UNASSIGNED"}
          </MButton>
          <div>
            <div onClick={() => setFieldSelected("ratio")}>
              <MInput label={__("Ratio")} value={""} />
            </div>
            <div onClick={() => setFieldSelected("timer")}>
              <MInput label={__("Timer")} value={""} />
            </div>
          </div>
          <MButton>{__("Start")}</MButton>
          <div>
            <div onClick={() => setFieldSelected("tick")}>
              <MInput
                disabled={timerState === null || timerState !== lineState.timer}
                label={__("Tick")}
                value={""} />
            </div>
            <div onClick={() => setFieldSelected("volume")}>
              <MInput
                disabled={timerState === null || timerState !== lineState.timer}
                label={__("Volume")}
                value={""} />
            </div>
          </div>
          <MButton>{__("Checked")}</MButton>
        </div>
      </StyledCalibration>

      {/* {
        fieldSelected !== null &&
        <ModalKeyboard
          title={__(fieldSelected.label_id)}
          type={ModalKeyboardTypes.Full}
          form={fieldSelected.value}
          cancel={() => setFieldSelected(null)}
          finish={value => {}}
          inputType={fieldSelected.type}
        />
      } */}

    </>
  );
};