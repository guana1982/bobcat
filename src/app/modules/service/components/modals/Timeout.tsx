import * as React from "react";
import { Box, ModalContentProps, Modal, ACTIONS_CONFIRM } from "../common/Modal";
import { MButton } from "../common/Button";
import { ConfigContext } from "@core/containers";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { flatMap } from "rxjs/operators";

interface TimeoutProps extends Partial<ModalContentProps> {}

export const Timeout = (props: TimeoutProps) => {
  const configConsumer = React.useContext(ConfigContext);
  const { cancel } = props;

  const { vendorConfig } = configConsumer;

  const [timeout, setTimeout] = React.useState<number>(vendorConfig.screen_saver_timeout);

  const decrease = () => setTimeout(prevState => prevState === 0 ? 0 : prevState - 1);
  const increase = () => setTimeout(prevState => prevState + 1);

  const saveTimeout = () => {
    mediumLevel.timeout.setTimeout(timeout)
    .pipe(
      flatMap(() => configConsumer.setVendorConfig)
    )
    .subscribe();
  };

  return (
    <Modal
      show={true}
      cancel={cancel}
      finish={saveTimeout}
      title="VIDEO TIMEOUT"
      actions={ACTIONS_CONFIRM}
    >
      <>
        <div>
          <Box className="centered">
            <MButton disabled visibled light info="TIMEOUT">{timeout} SECONDS</MButton>
          </Box>
          <Box className="centered">
            <MButton onClick={decrease}>DECREASE TIMEOUT</MButton>
            <MButton onClick={increase}>INCREASE TIMEOUT</MButton>
          </Box>
        </div>
      </>
    </Modal>
  );
};