import * as React from "react";
import { Box, Modal, ModalContentProps, ACTIONS_CLOSE, ACTIONS_CONFIRM } from "../common/Modal";
import { MButton } from "../common/Button";
import { VideoSelection, PaymentSelection } from "../sections/Selections";

enum SelectionTypes {
  None = "none",
  Video = "video",
  Payment = "payment"
}

interface CustomizeProps extends Partial<ModalContentProps> {}

export const Customize = (props: CustomizeProps) => {
  const { cancel } = props;
  const [selection, setSelection] = React.useState<SelectionTypes>(SelectionTypes.None);

  if (selection === SelectionTypes.None)
  return (
    <Modal
      show={true}
      cancel={cancel}
      title="CUSTOMIZE UI"
      subTitle="SELECT DESIRED ACTION"
      actions={ACTIONS_CLOSE}
    >
      <Box className="centered">
        <MButton onClick={() => setSelection(SelectionTypes.Video)}>VIDEO SELECTION</MButton>
        <MButton onClick={() => setSelection(SelectionTypes.Payment)}>PAYMENT SELECTION</MButton>
      </Box>
    </Modal>
  );

  if (selection === SelectionTypes.Video)
  return (
    <Modal
      show={true}
      cancel={() => setSelection(SelectionTypes.None)}
      title="VIDEO SELECTION"
      subTitle="SELECT DESIRED VIDEO"
      actions={ACTIONS_CONFIRM}
    >
      <VideoSelection />
    </Modal>
  );

  if (selection === SelectionTypes.Payment)
  return (
    <Modal
      show={true}
      cancel={() => setSelection(SelectionTypes.None)}
      title="PAYMENT SELECTION"
      subTitle="SELECT FREE / PAID"
      actions={ACTIONS_CONFIRM}
    >
      <PaymentSelection />
    </Modal>
  );
};