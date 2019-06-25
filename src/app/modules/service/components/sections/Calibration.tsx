import * as React from "react";
import styled from "styled-components";
import { MButton, MTypes } from "../common/Button";
import BeverageLogo from "@core/components/common/Logo";
import { MInput } from "../common/Input";
import { __ } from "@core/utils/lib/i18n";
import { ModalKeyboard, ModalKeyboardTypes } from "../common/ModalKeyboard";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { switchMap, tap, timeout, delay } from "rxjs/operators";
import { interval, of } from "rxjs";
import { AlertContext } from "@core/containers";

interface CalibrationProps {
  line?: any;
  waters?: boolean;
  onEnd?: (v) => void;
  lineStatus?: any;
}

const StyledCalibration = styled.div`
  .select-box {
    display: flex;
    align-items: center;
  }
  .select-box > * { display: inline-block; }
  & > div input {
    width: 150px;
    margin: 5px 0px;
  }
  input:disabled {
    background: #c1c1c1;
  }
`;

let timerStart_;
let timerStop_;
const MAX_TIME_EROGATION = 30000;

export const Calibration = (props: CalibrationProps) => {

  const { line, waters, onEnd, lineStatus } = props;

  const alertConsumer = React.useContext(AlertContext);

  const [lineState, setLineState] = React.useState({
    ratio: "45",
    timer: waters ? "20" : "60",
    tick: "",
    volume: ""
  });
  const [timerState, setTimerState] = React.useState(false);
  const [fieldSelected, setFieldSelected] = React.useState(null);

  const updateInputValue = (value) => {
    setLineState(prev => ({
      ...prev,
      [fieldSelected]: value
    }));
  };

  const start = () => {
    setTimerState(true);
    setLineState(prev => ({...prev, tick: "", volume: ""}));
    timerStart_ = mediumLevel.line.startCalibrate(line.line_id, !waters ? lineState.ratio : null)
      .pipe(
        switchMap(() => interval(MAX_TIME_EROGATION)),
        switchMap(() => mediumLevel.line.startCalibrate(line.line_id, !waters ? lineState.ratio : null))
      ).subscribe();

      timerStop_ = of("---")
      .pipe(
        delay(Number(lineState.timer) * 1000),
        switchMap(() => stop())
      ).subscribe(data => setLineState(prev => ({...prev, tick: data.tick})));
  };

  const stop = (force?: boolean) => {
    setTimerState(false);
    timerStart_.unsubscribe();
    if (force) {
      timerStop_.unsubscribe();
    }
    return mediumLevel.line.stopCalibrate(line.line_id);
  };

  const checkStatus = () => {
    mediumLevel.line.setCalibrate(line.line_id, lineState.volume, lineState.tick)
    .pipe(
      tap(data => {
        if (data.error) {
          alertConsumer.show({
            timeout: false,
            title: "ERROR",
            content: __(data.error)
          });
        }
      })
    )
    .subscribe(data => onEnd(!data.error ? true : false));
  };

  React.useEffect(() => {
    return () => {
      if (timerStart_)
        timerStart_.unsubscribe();
      if (timerStop_)
        timerStop_.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    Number(lineState.volume) > 0 && checkStatus();
  }, [lineState.volume]);


  return (
    <>
      <StyledCalibration>
        <div className="select-box">
          <MButton
            type={timerState ? MTypes.INFO_WARNING : null}
            className="small"
            light
            info={`Line - ${line.line_id}`}>
              {line.$beverage ? <BeverageLogo beverage={line.$beverage} size="tiny" /> : "UNASSIGNED"}
          </MButton>
          <div>
            { !waters && <div onClick={() => !timerState ? setFieldSelected("ratio") : {}}>
              <MInput disabled={timerState} label={__("Ratio")} value={lineState.ratio} />
            </div> }
            <div onClick={() => !timerState ? setFieldSelected("timer") : {}}>
              <MInput disabled={timerState} label={__("Timer")} value={lineState.timer} />
            </div>
          </div>
          <MButton
            disabled={!(Number(lineState.timer) > 0 && Number(lineState.ratio) > 0)}
            onClick={() => !timerState ? start() : stop(true).subscribe()}
          >
            {__(!timerState ? "Start" : "Stop")}
          </MButton>
          <div>
            <div>
              <MInput
                disabled={true}
                label={__("Tick")}
                value={lineState.tick} />
            </div>
            <div onClick={() => lineState.tick !== "" ? setFieldSelected("volume") : {}}>
              <MInput
                disabled={lineState.tick === ""}
                label={__("Volume")}
                value={lineState.volume} />
            </div>
          </div>
          <MButton
            // onClick={() => lineState.volume !== "" ? checkStatus() : {}}
            // disabled={/* lineState.volume === "" */ true}
            info
            type={lineStatus ? MTypes.INFO_SUCCESS : lineStatus === false ? MTypes.INFO_DANGER : null}
            >{__("Check")}</MButton>
        </div>
      </StyledCalibration>

      {
        fieldSelected !== null &&
        <ModalKeyboard
          title={__(fieldSelected)}
          type={ModalKeyboardTypes.Number}
          form={[lineState[fieldSelected]]}
          cancel={() => setFieldSelected(null)}
          finish={value => updateInputValue(value)}
        />
      }

    </>
  );
};