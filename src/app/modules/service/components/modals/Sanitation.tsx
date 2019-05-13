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

const TIMER_SANITATION = 35;

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
            verified: false
          },
          5: {
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

    if (line_.seconds === 0) {
      return;
    }
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
      if (linesSelected.length !== 0) {
        setDisableNext_(false);
        return;
      }
    } else if (step !== 0 && step !== 4) {
      let validLiness_ = true;
      linesSelected.forEach(line => {
        if (line.steps[step].seconds !== 0) {
          validLiness_ = false;
          return;
        }
      });
      if (validLiness_) {
        setDisableNext_(false);
        return;
      }
    } else if (step === 4) {
      let validLiness_ = true;
      linesSelected.forEach(line => {
        if (line.steps[step].verified !== true) {
          validLiness_ = false;
          return;
        }
      });
      if (validLiness_) {
        setDisableNext_(false);
        return;
      }
    }

    setDisableNext_(true);
  }, [step, linesSelected]);
  //  <=== ENABLE NEXT ====

  //  ==== DISABLE BACK ====>
  const [disableBack_, setDisableBack_] = React.useState<boolean>(false);
  React.useEffect(() => {
    linesSelected.forEach(line => {
      if (step !== 0 && step !== 4) {
        let countTimers_ = 0;
        linesSelected.forEach(lineSelected => {
          if (lineSelected.steps[step].$timer)
            countTimers_++;
        });
        setDisableBack_(countTimers_ > 0);
      } else {
        setDisableBack_(false);
      }
    });
  }, [step, linesSelected]);
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

  return (
    <Modal
      show={true}
      title="SANITATION"
      actions={...actionsModal(6, finishSanitation, disableNext_, disableBack_)}
    >
      <>
        <div>
          <ISteps icons={icons} current={step}>
            <ISteps.Step title="STEP 1" description="SELECTION" />
            <ISteps.Step title="STEP 2" description="TIMER" />
            <ISteps.Step title="STEP 3" description="TIMER" />
            <ISteps.Step title="STEP 4" description="TIMER" />
            <ISteps.Step title="STEP 5" description="VERIFICATION" />
            <ISteps.Step title="STEP 6" description="TIMER" />
          </ISteps>
          <Box className="container">
            <ISection>
              <>
              {step === 0 && (
                <Box className="container no-border">
                  <h3 id="title">{__(`sanitate_step_${step}_title`)}</h3>
                  <h3 id="title">{__(`sanitate_step_${step}_descr`)}</h3>
                  <br />
                  <h3 id="title">flavor</h3>
                  <Box className="elements">
                    {lines.pumps.map((line, i) => {
                      return (
                        <MButton key={i} onClick={() => handleLine(line)} className="small" type={isLineSelected(line) ? MTypes.INFO_SUCCESS : null} light info={`Line - ${line.line_id}`}>
                          {!line.$beverage ?
                            "UNASSIGNED" :
                            <BeverageLogo beverage={line.$beverage} size="tiny" />
                          }
                        </MButton>
                      );
                    })}
                  </Box>
                  <h3 id="title">waters</h3>
                  <Box className="elements">
                    {lines.waters.map((line, i) => {
                      return (
                        <MButton key={i} onClick={() => handleLine(line)} className="small" type={isLineSelected(line) ? MTypes.INFO_SUCCESS : null} light info={`${line.$beverage.beverage_type} - ${line.line_id}`}>
                          <BeverageLogo beverage={line.$beverage} size="tiny" />
                        </MButton>
                      );
                    })}
                  </Box>
                </Box>
              )}
              {(step !== 0 && step !== 4) && (
                <Box className="container no-border">
                  <h3 id="title">{__(`sanitate_step_${step}_title`)}</h3>
                  <h3 id="title">{__(`sanitate_step_${step}_descr`)}</h3>
                  <br />
                  <h3 id="title">lines</h3>
                  <Box className="elements">
                    {Object.values(lines).map(lines => {
                      return lines.map((line, i) => {
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
                      });
                    })}
                  </Box>
                </Box>
              )}
              {step === 4 && (
                <Box className="container no-border">
                <h3 id="title">{__(`sanitate_step_${step}_title`)}</h3>
                <h3 id="title">{__(`sanitate_step_${step}_descr`)}</h3>
                <br />
                <h3 id="title">lines</h3>
                <Box className="elements">
                  {Object.values(lines).map(lines => {
                    return lines.map((line, i) => {
                      const indexLineSelected_ =  indexLineSelected(line);
                      if (indexLineSelected_ === -1) return null;
                      const lineSelected_ = linesSelected[indexLineSelected_];
                      const line_ = lineSelected_.steps[step];
                      return (
                        <MButton key={i} onClick={() => verifiedLine(line)} type={line_.verified ? MTypes.INFO_SUCCESS : null} light info={`Line - ${line.line_id}`}>
                          {!line.$beverage ?
                            "UNASSIGNED" :
                            <BeverageLogo beverage={line.$beverage} size="tiny" />
                          }
                        </MButton>
                      );
                    });
                  })}
                </Box>
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