import { withHandlers, compose, withState } from "recompose";
import query from "../enhancers/fetchState";
import mediumLevel from "../lib/mediumLevel";

const MAX_DISPENSING_LINES = 3;
const STEPS_COUNT = 3;
const STEP_ETA = {
  0: process.env.NODE_ENV === "development" ? 1 : 15,
  1: process.env.NODE_ENV === "development" ? 1 : 15,
  2: process.env.NODE_ENV === "development" ? 1 : 15
};
let timeout;
let lineInterval = {};

export default compose(
  withState("step", "setStep", 0),
  withState("completed", "setCompleted", []),
  withState("operationStatus", "setOperationStatus", {}),
  withState("timer", "setTimer", {}),
  query(mediumLevel.config.startClean, {
    name: "startClean"
  }),
  query(mediumLevel.config.stopClean, {
    name: "stopClean"
  }),
  query(mediumLevel.config.sanitationCompleted, {
    name: "saveCompleted"
  }),
  withHandlers({
    nextStep: ({ setStep }) => () => {
      setStep(current => current + 1);
    },
    prevStep: ({ setStep }) => () => {
      setStep(current => current - 1);
    },
    goToStep: ({ setStep }) => step => {
      setStep(step);
    },
    saveCompletedLines: ({ saveCompleted, completed, onFinish }) => async () => {
      console.log("saveCompletedLines", completed);
      // get lines that completed all the 4 steps
      const uniqueCompletedLines = [
        ...new Set(
          completed
            .filter(line => {
              return completed.filter(c => c.id === line.id).length === STEPS_COUNT;
            })
            .map(l => l.id)
        )
      ];
      if (uniqueCompletedLines.length > 0) {
        // send call to mark lines as succesfully sanitified
        await saveCompleted({
          line_id: uniqueCompletedLines
        });
      }
      onFinish();
    },
    clearTimer: ({ timer, setTimer }) => () => {
      Object.keys(lineInterval).forEach(key => {
        clearInterval(lineInterval[key]);
      });
      setTimer({});
    },
    start: ({
      stopClean,
      operationStatus = {},
      startClean,
      setOperationStatus,
      setCompleted,
      timer,
      setTimer
    }) => async (step, line) => {
      if (!timer[line.line_id]) {
        timer[line.line_id] = 0;
      }
      if (
        operationStatus[step] &&
        Object.keys(operationStatus[step]).filter(l => operationStatus[step][l].status === 2).length >=
          MAX_DISPENSING_LINES
      ) {
        return;
      }
      await startClean({
        line_id: line.line_id
      });
      let eta = STEP_ETA[step];
      setOperationStatus(
        current => ({
          ...current,
          [step]: {
            ...current[step],
            [line.line_id]: {
              eta,
              status: 2
            }
          }
        }),
        () => {
          const updateStatus = () => {
            timeout = setTimeout(() => {
              setOperationStatus(
                current => {
                  eta = eta - 1;
                  if (eta === 0) {
                    // stopClean({
                    //   line_id: line.line_id,
                    // })
                    setCompleted(c => [...c, { id: line.line_id, step }]);
                  }
                  return {
                    ...current,
                    [step]: {
                      ...current[step],
                      [line.line_id]: {
                        eta,
                        status: 2
                      }
                    }
                  };
                },
                () => {
                  if (eta > 0) {
                    updateStatus();
                  }
                }
              );
            }, 1000);
          };
          updateStatus();
        }
      );
      lineInterval[line.line_id] = setInterval(() => {
        timer[line.line_id] = timer[line.line_id] + 1000;
        setTimer(timer);
      }, 1000);
    },
    stop: ({ stopClean, setOperationStatus }) => (operation, step, line) => {
      clearTimeout(timeout);
      clearInterval(lineInterval[line.line_id]);
      stopClean({
        line_id: line.line_id
      });
      setOperationStatus(current => ({
        ...current,
        [step]: {
          ...current[step],
          [line.line_id]: {
            ...operation,
            status: operation === 2 ? 0 : operation
          }
        }
      }));
    }
  })
);
