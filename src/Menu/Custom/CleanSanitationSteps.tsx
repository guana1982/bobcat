import * as React from "react";
import { compose, withProps, setDisplayName, withState } from "recompose";
import { __ } from "../../utils/lib/i18n";
import withCleanSanitation from "../../utils/enhancers/cleanSanitationLean";
import BeverageLogo from "../../components/common/Logo";
import * as styles from "./CleanSanitation.scss";

const COLORS = {
  0: "lightgray",
  1: "mediumspringgreen",
  2: "orange"
};
const enhance = compose(
  setDisplayName("CleanSanitationStep1"),
  withProps(() => ({
    elementsAccessor: ({ lines }) => lines
  })),
  withCleanSanitation
);
const millisToMinutesAndSeconds = millis => {
  let minutes = Math.floor(millis / 60000);
  let seconds: any = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};
const timer = 0;
const toggleStartStop = (status, line, stop, start, step, toggleExit, canExitOrContinue) => () => {
  console.log("canExitOrContinue", canExitOrContinue);
  toggleExit(!canExitOrContinue);
  if (status === 2) {
    return stop(status, step, line);
  }
  start(step, line);
};
const onGoBack = (step, prevStep, onFinish, clearTimer) => () => {
  clearTimer();
  if (step > 0) {
    return prevStep();
  }
  onFinish();
  // navigation.pop()
};
const onContinue = (nextStep, saveCompletedLines, step, clearTimer) => () => {
  clearTimer();
  if (step < 4) {
    return nextStep();
  }
  saveCompletedLines();
};
const verifyPhLine = (status, line, step, verifyPh, toggleExit) => () => {
  toggleExit(false);
  verifyPh(status, step, line);
};

const Lines = enhance(
  ({ operationStatus, lines, start, stop, step, nextStep, prevStep, goToStep, navigation, saveCompletedLines, completed, onFinish, timer, clearTimer, phVerified, verifyPh, toggleExit }) => {
    const stepLinesStatus = operationStatus[step] || {};
    const linesStaus = Object.keys(stepLinesStatus).length > 0 ? Object.keys(stepLinesStatus).map(e => stepLinesStatus[e]).map((v: any) => v.status) : []; // Object.values(stepLinesStatus)
    const canExitOrContinue = step === 3 ? true : !linesStaus.includes(2);
    const completedLinesPerStep = completed.filter(l => l.step === step);
    return (
      <React.Fragment>
        <div className={styles.help} style={{ background: "#fff", padding: "1em", boxSizing: "border-box" }}>
          <h3>
            {step + 1}. {__(`sanitate_step_${step + 1}_title`)}
          </h3>
          <p>{__(`sanitate_step_${step + 1}_descr`)}</p>
        </div>
        <div className={styles.lines} style={{ flexFlow: "column-wrap", marginTop: "20%" }}>
          {lines
            .filter(l => {
              if (step > 0) {
                return completed.find(c => c.id === l.line_id && c.step === step - 1);
              }
              return true;
            })
            .map((line, index) => {
              const stepLineStatus = stepLinesStatus[line.line_id] || {};
              return (
                <div
                  key={index}
                  className={styles.line}
                  onClick={step === 3 ? verifyPhLine(stepLineStatus.status, line, step, verifyPh, toggleExit) : toggleStartStop(stepLineStatus.status, line, stop, start, step, toggleExit, canExitOrContinue)}
                >
                  <div className={styles.lineNo}>
                    {__("line")} #{line.line_id}
                    <div className={styles.status}>
                      {step !== 3 && <label>{stepLineStatus.status !== 2 ? __("start") : __("stop")}</label>}

                      <BeverageLogo beverage={line} />
                    </div>
                    {step === 3 ? (
                      <div className={styles.phButton} style={{ backgroundColor: phVerified[line.line_id] ? "green" : "#555" }}>
                        {"PH VERIFIED"}
                      </div>
                    ) : (
                      <div className={styles.timer}>{timer[line.line_id] ? millisToMinutesAndSeconds(timer[line.line_id]) : "0:00"}</div>
                    )}
                  </div>
                </div>
              );
            })}
          <div className={"menu-button-bar"}>
            <button disabled={!canExitOrContinue} className={"button-bar__button"} onClick={canExitOrContinue ? onGoBack(step, prevStep, onFinish, clearTimer) : null}>
              {__("back")}
            </button>
            <button
              disabled={!canExitOrContinue || completedLinesPerStep.length === 0}
              className={"button-bar__button"}
              onClick={canExitOrContinue ? onContinue(nextStep, saveCompletedLines, step, clearTimer) : null}
            >
              {step < 4 ? __(`sanitate_step_${step + 2}_title`) : __("finish")}
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
);

export default ({ lines = [], navigation, ...rest }) => {
  return <div style={{ height: "100%" }}>{lines.length > 0 && <Lines lines={lines} navigation={navigation} {...rest} />}</div>;
};
