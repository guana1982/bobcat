import * as React from "react";
import { Modal, ModalContentProps, Box, ACTIONS_CLOSE, Action } from "@modules/service/components/common/Modal";
import Steps from "rc-steps";
import styled from "styled-components";
import "rc-steps/assets/index.css";
import { ServiceContext, AlertContext, ILine } from "@core/containers";
import { MButton, MTypes } from "@modules/service/components/common/Button";
import { __ } from "@core/utils/lib/i18n";
import BeverageLogo from "@core/components/common/Logo";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { line } from "@core/Menu/Custom/Lines.scss";

const TIMER_SANITATION = 35;
const TIMER_RINSING = 240;
const TIMER_PH = 20;
const TIMER_SANITIZER = 5 * 60;

const fmtMSS = (s) => (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0" ) + s;

const ACTIONS_START = (cancel, next, disableNext: boolean , disableBack: boolean): Action[] => [{
  title: __("cancel"),
  disabled: disableBack,
  event: cancel,
}, {
  title: __("next"),
  disabled: disableNext,
  event: next,
}];

const ACTIONS_CONTROL = (cancel, previous, next, disableNext: boolean, disableBack: boolean): Action[] => [{
  title: __("cancel"),
  disabled: disableBack,
  event: cancel,
}, {
  title: __("previous"),
  disabled: disableBack,
  event: previous,
}, {
  title: __("next"),
  disabled: disableNext,
  event: next,
}];

const ACTIONS_END = (cancel, previous, finish, disableNext: boolean, disableBack: boolean): Action[] => [{
  title: __("cancel"),
  disabled: disableBack,
  event: cancel,
}, {
  title: __("previous"),
  disabled: disableBack,
  event: previous,
}, {
  title: __("finish"),
  disabled: disableNext,
  event: finish,
}];

const IconCheck = props => (
  <svg viewBox="0 0 26 26" width={10} height={10} {...props}>
    <path
      d="M.3 14c-.2-.2-.3-.5-.3-.7s.1-.5.3-.7l1.4-1.4c.4-.4 1-.4 1.4 0l.1.1 5.5 5.9c.2.2.5.2.7 0L22.8 3.3h.1c.4-.4 1-.4 1.4 0l1.4 1.4c.4.4.4 1 0 1.4l-16 16.6c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3L.5 14.3.3 14z"
      fill="#FFF"
    />
  </svg>
);

const icons = {
  finish: <IconCheck />
};

export const ISteps = styled(Steps)`
  min-width: 400px;
  padding: 20px;
  font-size: auto;
  &.small {
    max-width: 400px;
    margin: auto;
  }
  .rc-steps-item-finish .rc-steps-item-icon,
  .rc-steps-item-process .rc-steps-item-icon {
    background-color: ${props => props.theme.dark};
    border-color: ${props => props.theme.dark};
  }
  .rc-steps-item-title:after {
    background-color: ${props => props.theme.dark} !important;
  }
  .rc-steps-item-icon {
    border-color: ${props => props.theme.dark} !important;
  }
  .rc-steps-item-title,
  .rc-steps-item-description {
    color: ${props => props.theme.dark} !important;
    text-transform: uppercase;
  }
  .rc-steps-item-description {
    font-size: 10px;
  }
  .rc-steps-item-wait .rc-steps-item-icon > .rc-steps-icon {
    color: ${props => props.theme.dark};
  }
  .rc-steps-item-finish .rc-steps-item-icon > .rc-steps-icon svg {
    margin-top: 8px !important;
  }
`;

export const ISection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 540px;
  min-width: 1100px;
  h2, h3 {
    margin: 0;
  }
`;

interface ILineSanitation {
  lineId: number;
  steps: any;
  // $timer: any;
  // seconds: number;
  // verified: boolean;
}

interface SanitationProps extends Partial<ModalContentProps> {

}

export const Sanitation = (props: SanitationProps) => {

  const { cancel } = props;
  const [step, setStep] = React.useState<number>(0);

  const serviceConsumer = React.useContext(ServiceContext);
  const alertConsumer = React.useContext(AlertContext);

  const { lines, endSanitation } = serviceConsumer;

  const [linesSelected, setlinesSelected] = React.useState<ILineSanitation[]>([]);
  const [sanitizerTimer, setSanitizerTimer] = React.useState<number>(null);

  const handleLine = ({ line_id }) => {
    const indexLineSelected_ = indexLineSelected({ line_id });
    setlinesSelected(prevState => {
      if (indexLineSelected_ > -1) {
        const linesSelected_ = prevState;
        linesSelected_.splice(indexLineSelected_, 1);
        return [...linesSelected_];
      }
      const newlineSelected_ = {
        lineId: line_id,
        steps: {
          1: {
            $timer: null,
            seconds: TIMER_SANITATION,
          },
          2: {
            $timer: null,
            seconds: TIMER_SANITATION,
          },
          3: {
            $timer: null,
            seconds: TIMER_SANITATION,
          },
          4: {
            $timer: null,
            seconds: TIMER_RINSING,
          },
          5: {
            $timer: null,
            seconds: TIMER_PH,
          },
          6: {
            $timer: null,
            seconds: TIMER_SANITATION,
          }
        }
      };
      return [ ...prevState, newlineSelected_ ];
    });
  };

  const indexLineSelected = ({ line_id }): number => {
    const indexLineSelected_ = linesSelected.findIndex(({ lineId }) => line_id === lineId);
    return indexLineSelected_;
  };

  const isLineSelected = ({ line_id }): boolean => {
    const indexLineSelected_ = indexLineSelected({line_id});
    const isLineSelected_ = indexLineSelected_ > -1;
    return isLineSelected_;
  };

  const handleTimerLine = ({ line_id }) => {
    const indexLineSelected_ = indexLineSelected({line_id});
    if (indexLineSelected_ === -1) {
      return;
    }

    const linesSelected_ = linesSelected;

    const lineSelected_ = linesSelected_[indexLineSelected_];
    const line_ = lineSelected_.steps[step];

    if (line_.seconds === 0) return;

    if (line_.$timer) {
      clearInterval(line_.$timer);
      line_.$timer = null;
      setlinesSelected(([...linesSelected_]));
      mediumLevel.sanitation.stopClean(lineSelected_.lineId).subscribe(); // <= STOP CLEAN
      return;
    }

    let countTimers_ = 0;
    linesSelected_.forEach(lineSelected => {
      if (lineSelected.steps[step].$timer)
        countTimers_++;
    });
    if (countTimers_ > 2) {
      return;
    } // => MAX 3 AT SAME TIME

    line_.$timer = setInterval(() => {
      if (line_.seconds === 1) {
        clearInterval(line_.$timer);
        line_.$timer = null;
        mediumLevel.sanitation.stopClean(lineSelected_.lineId).subscribe(); // <= STOP CLEAN
      }
      line_.seconds--;
      setlinesSelected(([...linesSelected_]));
    }, 1000);

    mediumLevel.sanitation.startClean(lineSelected_.lineId).subscribe(); // <= START CLEAN
    setlinesSelected(([...linesSelected_]));
  };

  const verifiedLine = ({ line_id }) => {
    const indexLineSelected_ = indexLineSelected({line_id});
    if (indexLineSelected_ === -1) {
      return;
    }

    const linesSelected_ = linesSelected;
    const lineSelected_ = linesSelected_[indexLineSelected_];
    const line_ = lineSelected_.steps[step];
    line_.verified = true;
    setlinesSelected(([...linesSelected_]));
  };

  const resetAllTimer = () => {
    const linesSelected_ = linesSelected.map(line => {
      line.steps[step].seconds = TIMER_SANITATION;
      return line;
    });
    setlinesSelected(([...linesSelected_]));
  };

  const clearAllTimer = () => {
    linesSelected.forEach(line => {
      clearInterval(line.steps[step].$timer);
    });
  };

  React.useEffect(() => {
    if (step === 0) {
      setlinesSelected([]);
    } else if (step !== 0 && step !== 4) {
      // resetAllTimer();
    }
    return () => {
      if (step !== 0 && step !== 4) {
        clearAllTimer();
      }
    };
  }, [step]);

  //  ==== ENABLE NEXT ====>
  const [disableNext_, setDisableNext_] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (step === 0) {
      setDisableNext_(false);
      return;
    } else if (step === 1) {
      if (linesSelected.length !== 0) {
        setDisableNext_(false);
        return;
      }
    } else if (step !== 0 && step !== 1) {
      let validLiness_ = true;
      linesSelected.forEach(line => {
        if (line.steps[step].seconds !== 0) {
          validLiness_ = false;
          return;
        }
      });

      if (step === 3 && sanitizerTimer !== 0) {
        setDisableNext_(true);
        return;
      }

      if (validLiness_) {
        setDisableNext_(false);
        return;
      }
    }

    setDisableNext_(true);
  }, [step, linesSelected, sanitizerTimer]);
  //  <=== ENABLE NEXT ====

  //  ==== DISABLE BACK ====>
  const [disableBack_, setDisableBack_] = React.useState<boolean>(false);
  React.useEffect(() => {
    linesSelected.forEach(line => {
      if (step !== 1 && step !== 5) {
        let countTimers_ = 0;
        let validLiness_ = true;
        linesSelected.forEach(lineSelected => {
          if (lineSelected.steps[step].$timer) {
            countTimers_++;
          }
          if (line.steps[step].seconds !== 0) {
            validLiness_ = false;
            return;
          }
        });

        if (step === 3 && sanitizerTimer !== 0 && validLiness_ ) {
          setDisableBack_(true);
          return;
        }

        setDisableBack_(countTimers_ > 0);
      } else {
        setDisableBack_(false);
      }
    });
  }, [step, linesSelected, sanitizerTimer]);
  //  <=== DISABLE BACK ====


  const actionsModal = (maxSteps: number, finish?: () => void, disableNext?: boolean, disableBack?: boolean) => {
    if (!finish) {
      finish = () => console.log("Pls add => Finish");
    }
    const cancel_ = () => {
      cancel();
    };
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    if (step === 0) {
      return ACTIONS_START(cancel_, nextStep, disableNext, disableBack);
    } else if (step === maxSteps - 1) {
      return ACTIONS_END(cancel_, prevStep, finish, disableNext, disableBack);
    } else {
      return ACTIONS_CONTROL(cancel_, prevStep, nextStep, disableNext, disableBack);
    }
  };

  const finishSanitation = () => {
    const lines_ = linesSelected.map(({ lineId }) => lineId);
    endSanitation(lines_)
    .subscribe(
      data => {
        cancel();
      }
    );
  };

  // ==== SANITIZER TIMER ====>
  const handleSanitizerTimer = () => {
    setTimeout(() => setSanitizerTimer(TIMER_SANITIZER), 1000);
  };

  React.useEffect(() => {
    if (step === 3 && sanitizerTimer !== 0) {
      let validLiness_ = true;
      linesSelected.forEach(line => {
        if (line.steps[step].seconds !== 0) {
          validLiness_ = false;
          return;
        }
      });
      validLiness_ && handleSanitizerTimer();
    }
  }, [step, linesSelected]);

  React.useEffect(() => {
    sanitizerTimer > 0 &&
      setTimeout(() => setSanitizerTimer(prevState => prevState - 1), 1000);
  }, [sanitizerTimer]);
  // <=== SANITIZER TIMER ====

  return (
    <Modal
      show={true}
      title="SANITATION"
      actions={...actionsModal(7, finishSanitation, disableNext_, disableBack_)}
    >
      <>
        <div>
          <ISteps icons={icons} current={step}>
            <ISteps.Step title="STEP 0" description="SANITATION PROCEDURE START" />
            <ISteps.Step title="STEP 1" description="LINE SELECTION" />
            <ISteps.Step title="STEP 2" description="Water filling" />
            <ISteps.Step title="STEP 3" description="SANITIZER FILLING" />
            <ISteps.Step title="STEP 4" description="RINSING" />
            <ISteps.Step title="STEP 5" description="PH COMPARISON" />
            <ISteps.Step title="STEP 6" description="SYRUP REFILLING" />
          </ISteps>
          <Box className="container">
            <ISection>
              <>
              {step === 0 && (
                <Box className="container no-border">
                  <h2 id="title">warning</h2>
                  <h3 id="title">Before carrying out the following operations, carefully read the instructions provided by the manufacturer of the sanitizing product and be sure to use personal protective equipment (latex gloves, masks, eye glasses).</h3>
                  <h3 id="title">Sanitization of product lines must only be carried out by qualified TECHNICAL SERVICE staff. During sanitization, it is recommended to put a warning sign that informs that sanitation is in progress and it is forbidden to dispense beverages. Make sure that the rooms are ventilated properly.</h3>
                  <br />
                  <h3 id="title">1. Prepare at least 2 gallons of sanitizing solution in accordance with the manufacturer recommendations using warm clean water at 80 - 100° F (26.7 - 37.8° C). The type and concentration of sanitizing agent shall comply with 40 CFR §180.940. The solution must provide 100 parts per million (PPM) of chlorine (e.g. Sodium Hypochlorite or bleach)</h3>
                  <br />
                  <h3 id="title">2. Unscrew the nozzle and the stainless steal diffusor</h3>
                  <br />
                  <h3 id="title">3. Drop nozzle and diffusor in a bucket with 0.25 gallons of sanitazer for 5 minutes and then let them dry</h3>
                  <br />
                  <h3 id="title">4. Spray some sanitizer on the nozzle component not detached from the unit</h3>
                  <br />
                  <h3 id="title">5. Detach the lines from the BiB and screw the «octopus» to the BiB connectors (in absence of the octopus remove springs and shutters from the connectors and drop them in the sanitizer bucket with the nozzle for 5 minutes)</h3>
                </Box>
              )}
              {step === 1 && (
                <Box className="container no-border">
                  <h3 id="title">{__(`sanitate_step_${step - 1}_title`)}</h3>
                  <br /><br />
                  <h3 id="title">flavor</h3>
                  <Box className="elements">
                    {
                      lines.pumps.map((line, i) => {
                        return (
                          <MButton key={i} onClick={() => handleLine(line)} className="small" type={isLineSelected(line) ? MTypes.INFO_SUCCESS : null} light info={`Line - ${line.line_id}`}>
                            {!line.$beverage ?
                              "UNASSIGNED" :
                              <BeverageLogo beverage={line.$beverage} size="tiny" />
                            }
                          </MButton>
                        );
                      })
                    }
                  </Box>
                </Box>
              )}
              {(step !== 0 && step !== 1) && (
                <Box className="container no-border">
                  {step === 2 && <h3 id="title">Drop the selected lines in a bucket with water and start dispensing. Continue dispensing until the lines are completely full of water. Please note, dispensing is possible for maximum 3 lines at a time</h3>}
                  {step === 3 && <h3 id="title">Remove the lines from the bucket with water connect them to the sanitizer and start dispensing. Continue dispensing until the lines are completely full with sanitizer liquid. Then wait for the time recommended in the sanitizer datasheet</h3>}
                  {step === 4 && <h3 id="title">Remove the lines from the sanitizer dive them in a bucket with clean and potable water and start dispensing . Continue dispensing until the lines are completely free of sanitizer</h3>}
                  {step === 5 && <h3 id="title">{__(`sanitate_step_${step - 1}_title`)}</h3>}
                  {step === 6 && <h3 id="title">CONNECT THE LINES TO THE BIBS AND DISPENSE TILL ALL THE LINES ARE FULL OF SYRUP. CLOSE THE FRONT DOOR AND RE-ASSEMBLE STAINLESS STEEL DIFFUSER AND PLASTIC NOZZLE.</h3>}
                  {step === 7 && <h3 id="title">{__(`sanitate_step_${step - 1}_title`)}</h3>}
                  <br /><br />
                  <h3 id="title">lines</h3>
                  <Box className="elements">
                    {
                      lines.pumps.map((line, i) => {
                        const indexLineSelected_ =  indexLineSelected(line);
                        if (indexLineSelected_ === -1) return null;
                        const lineSelected_ = linesSelected[indexLineSelected_];
                        const line_ = lineSelected_.steps[step];
                        return (
                          <MButton key={i} onClick={() => handleTimerLine(line)} type={line_.$timer ? MTypes.INFO_WARNING : line_.seconds === 0 ? MTypes.INFO_SUCCESS : null} light info={`Line - ${line.line_id} / ${line_.seconds}`}>
                            {!line.$beverage ?
                              "UNASSIGNED" :
                              <BeverageLogo beverage={line.$beverage} size="tiny" />
                            }
                          </MButton>
                        );
                      })
                    }
                  </Box>
                  <br />
                  {(step === 3 && sanitizerTimer !== null) && (
                    <>
                      <h3 id="title">Wait for the sanitizer required time before rinsing</h3>
                      <h1 id="title">{fmtMSS(sanitizerTimer)}</h1>
                    </>
                  )}
                </Box>
              )}
              </>
            </ISection>
          </Box>
        </div>
      </>
    </Modal>
  );

};