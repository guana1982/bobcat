import * as React from "react";
import { Modal, ModalContentProps, Box, ACTIONS_CLOSE, Action } from "@modules/service/components/common/Modal";
import Steps from "rc-steps";
import styled from "styled-components";
import "rc-steps/assets/index.css";
import ConnectivityComponent from "../sections/Connectivity";
import { ServiceContext, AlertContext, ILine } from "@core/containers";
import { MButton, MTypes } from "@modules/service/components/common/Button";
import { MInput, InputContent } from "../common/Input";
import { MKeyboard, KeyboardWrapper } from "../common/Keyboard";
import { __ } from "@core/utils/lib/i18n";
import { MButtonGroup } from "../common/ButtonGroup";
import BeverageLogo from "@core/components/common/Logo";

const ACTIONS_START = (cancel, next, disableNext: boolean): Action[] => [{
  title: __("cancel"),
  event: cancel,
}, {
  title: __("next"),
  disabled: disableNext,
  event: next,
}];

const ACTIONS_CONTROL = (cancel, previous, next, disableNext: boolean): Action[] => [{
  title: __("cancel"),
  event: cancel,
}, {
  title: __("previous"),
  event: previous,
}, {
  title: __("next"),
  disabled: disableNext,
  event: next,
}];

const ACTIONS_END = (cancel, previous, finish, disableNext: boolean): Action[] => [{
  title: __("cancel"),
  event: cancel,
}, {
  title: __("previous"),
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
  ${KeyboardWrapper} {
    margin-top: 20px;
  }
  .form-section {
    margin-top: 10px;
    max-width: 975px;
    flex-wrap: wrap;
    ${InputContent} {
      flex: 50%;
      margin-bottom: 8px;
    }
  }
`;

interface ILineSanitation {
  lineId: number;
  $timer: any;
  seconds: number;
}

interface SanitationProps extends Partial<ModalContentProps> {

}

export const Sanitation = (props: SanitationProps) => {

  const { cancel } = props;
  const [step, setStep] = React.useState<number>(0);

  const serviceConsumer = React.useContext(ServiceContext);
  const alertConsumer = React.useContext(AlertContext);

  const { lines } = serviceConsumer;

  const [linesSelected , setlinesSelected] = React.useState<ILineSanitation[]>([]);

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
        $timer: null,
        seconds: 30
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


    const lineSelected_ = linesSelected[indexLineSelected_];
    lineSelected_.$timer = setInterval(() => {
      lineSelected_.seconds--;
      setlinesSelected(([...linesSelected, lineSelected_]));
    }, 1000);

    setlinesSelected(([...linesSelected, lineSelected_]));
  };

  //  ==== ENABLE NEXT ====>
  const [disableNext_, setDisableNext_] = React.useState<boolean>(true);

  React.useEffect(() => {

    setDisableNext_(false);
    // setDisableNext_(true);
  }, []);

  //  <=== ENABLE NEXT ====

  const actionsModal = (maxSteps: number, finish?: () => void, disableNext?: boolean) => {
    if (!finish) {
      finish = () => console.log("Pls add => Finish");
    }
    const cancel_ = () => {
      cancel();
    };
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    if (step === 0) {
      return ACTIONS_START(cancel_, nextStep, disableNext);
    } else if (step === maxSteps - 1) {
      return ACTIONS_END(cancel_, prevStep, finish, disableNext);
    } else {
      return ACTIONS_CONTROL(cancel_, prevStep, nextStep, disableNext);
    }
  };

  const finishSanitation = () => {
    alert("finishSanitation");
    cancel();
  };

  return (
    <Modal
      show={true}
      title="SANITATION"
      actions={...actionsModal(5, finishSanitation, disableNext_)}
    >
      <>
        <div>
          <ISteps icons={icons} current={step}>
            <ISteps.Step title="OPERATIONS" description="SELECT OPERATIONS" />
            <ISteps.Step title="LANGUAGE" description="SELECT LANGUAGE" />
            <ISteps.Step title="PAYMENT" description="SELECT PAYMENT" />
            <ISteps.Step title="COUNTRY" description="SELECT COUNTRY" />
            <ISteps.Step title="CONNECTION" description="CHECK CONNECTION" />
          </ISteps>
          <Box className="container">
            <ISection>
              <>
              {step === 0 && (
                <Box className="container no-border">
                  <h3 id="title">flavor</h3>
                  <Box className="elements">
                    {lines.pumps.map((line, i) => {
                      return (
                        <MButton key={i} onClick={() => handleLine(line)} type={isLineSelected(line) ? MTypes.INFO_SUCCESS : null} light info={`Line - ${line.line_id}`}>
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
                        <MButton key={i} onClick={() => handleLine(line)} type={isLineSelected(line) ? MTypes.INFO_SUCCESS : null} light info={`${line.$beverage.beverage_type} - ${line.line_id}`}>
                          <BeverageLogo beverage={line.$beverage} size="tiny" />
                        </MButton>
                      );
                    })}
                  </Box>
                </Box>
              )}
              {step === 1 && (
                <Box className="container no-border">
                  <h3 id="title">flavor</h3>
                  <Box className="elements">
                    {lines.pumps.map((line, i) => {
                      const indexLineSelected_ =  indexLineSelected(line);
                      if (indexLineSelected_ === -1) return null;
                      const lineSelected_ = linesSelected[indexLineSelected_];
                      return (
                        <MButton key={i} onClick={() => handleTimerLine(line)} light info={`Line - ${line.line_id} / ${lineSelected_.seconds}`}>
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
                      const indexLineSelected_ = indexLineSelected(line);
                      if (indexLineSelected_ === -1) return null;
                      const lineSelected_ = linesSelected[indexLineSelected_];
                      return (
                        <MButton key={i} onClick={() => handleTimerLine(line)} light info={`Line - ${line.line_id} / ${lineSelected_.seconds}`}>
                          <BeverageLogo beverage={line.$beverage} size="tiny" />
                        </MButton>
                      );
                    })}
                  </Box>
                </Box>
              )}
              {step === 2 && (
                <div>Step: {step}</div>
              )}
              {step === 3 && (
                <div>Step: {step}</div>
              )}
              {step === 4 && (
                <div>Step: {step}</div>
              )}
              </>
            </ISection>
          </Box>
        </div>
      </>
    </Modal>
  );

};