import * as React from "react";
import { compose, withProps, setDisplayName } from "recompose";
import { __ } from "../../lib/i18n";
import withCleanSanitation from "../../enhancers/cleanSanitation";
import BeverageLogo from "../../VendorComponents/Beverage/Logo";
import * as styles from "../../VendorComponents/Menu/Custom/CleanSanitation.scss";

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
  let seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (Number(seconds) < 10 ? "0" : "") + seconds;
};
const timer = 0;
const toggleStartStop = (status, line, stop, start, step, toggleExit, canExitOrContinue) => () => {
  console.log("canExitOrContinue", canExitOrContinue);
  if (status === 2) {
    stop(status, step, line);
    toggleExit(!canExitOrContinue);
    return;
  }
  start(step, line);
  toggleExit(!canExitOrContinue);
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
  if (step < 2) {
    return nextStep();
  }
  saveCompletedLines();
};
const Lines = enhance(
  ({
    operationStatus,
    lines,
    start,
    stop,
    step,
    nextStep,
    prevStep,
    goToStep,
    navigation,
    saveCompletedLines,
    completed,
    onFinish,
    timer,
    clearTimer,
    toggleExit
  }) => {
    const stepLinesStatus = operationStatus[step] || {};
    const linesStaus = Object.keys(stepLinesStatus).length > 0 ? Object.keys(stepLinesStatus).map(e => stepLinesStatus[e]).map((v: any) => v.status) : []; // Object.values(stepLinesStatus)
    console.log(linesStaus, linesStaus.includes(2));
    const canExitOrContinue = !linesStaus.includes(2);
    console.log("canExitOrContinue pre", canExitOrContinue);
    const completedLinesPerStep = completed.filter(l => l.step === step);
    console.log(completed);
    return (
      <React.Fragment>
        <div className={styles.help} style={{ background: "#fff", padding: "1em", boxSizing: "border-box" }}>
          <h3>
            {step + 1}. {__(`sanitate_step_${step + 1}_title`)}
          </h3>
          <p>{__(`sanitate_step_${step + 1}_descr`)}</p>
        </div>
        <div className={styles.lines} style={{ flexFlow: "column-wrap" }}>
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
                  onClick={toggleStartStop(stepLineStatus.status, line, stop, start, step, toggleExit, canExitOrContinue)}
                >
                  <div className={styles.lineNo}>
                    {__("line")} #{line.line_id}
                    <div className={styles.status}>
                      <label>{stepLineStatus.status !== 2 ? __("start") : __("stop")}</label>

                      <BeverageLogo beverage={line} />
                    </div>
                    <div className={styles.timer}>
                      {timer[line.line_id] ? millisToMinutesAndSeconds(timer[line.line_id]) : "0:00"}
                    </div>
                  </div>
                </div>
              );
            })}
          <div className={"menu-button-bar"}>
            <button
              disabled={!canExitOrContinue}
              className={"button-bar__button"}
              onClick={canExitOrContinue ? onGoBack(step, prevStep, onFinish, clearTimer) : null}
            >
              {__("back")}
            </button>
            <button
              disabled={!canExitOrContinue || completedLinesPerStep.length === 0}
              className={"button-bar__button"}
              onClick={canExitOrContinue ? onContinue(nextStep, saveCompletedLines, step, clearTimer) : null}
            >
              {step < 2 ? __(`sanitate_step_${step + 2}_title`) : __("finish")}
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
);

export default (lines: any = [], navigation?, ...rest) => {
  return (
    <div style={{ height: "100%" }}>{lines.length > 0 && <Lines lines={lines} navigation={navigation} {...rest} />}</div>
  );
};
