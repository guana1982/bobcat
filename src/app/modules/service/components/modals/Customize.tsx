import * as React from "react";
import { Box, Modal, ModalContentProps, ACTIONS_CLOSE, ACTIONS_CONFIRM } from "../common/Modal";
import { MButton } from "../common/Button";
import { MButtonGroup } from "../common/ButtonGroup";
import { ServiceContext } from "@core/containers";
// import { VideoSelection, PaymentSelection } from "../sections/Selections";

export enum SelectionTypes {
  None = "none",
  Video = "video",
  Payment = "payment",
  Language = "language"
}

interface CustomizeProps extends Partial<ModalContentProps> {
  selection?: SelectionTypes;
}

export const Customize = (props: CustomizeProps) => {
  const { cancel } = props;
  const [selection, setSelection] = React.useState<SelectionTypes>(props.selection || SelectionTypes.None);
  const [valueSelected, setValueSelected] = React.useState(null);

  const serviceConsumer = React.useContext(ServiceContext);
  const { video, payment, language } = serviceConsumer.allList;

  const cleanSelection = () => {
    if (props.selection) {
      cancel();
      return;
    }
    setSelection(SelectionTypes.None);
  };

  React.useEffect(() => {
    let value = null;
    if (selection === SelectionTypes.Video) {
      value = video.valueSelected;
    } else if (selection === SelectionTypes.Payment) {
      value = payment.valueSelected;
    } else if (selection === SelectionTypes.Language) {
      value = language.valueSelected;
    }
    setValueSelected(value);
  }, [selection]);

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
        {/* <MButton onClick={() => setSelection(SelectionTypes.Payment)}>PAYMENT SELECTION</MButton> */}
      </Box>
    </Modal>
  );

  if (selection === SelectionTypes.Video)
  return (
    <Modal
      show={true}
      cancel={cleanSelection}
      finish={() => video.update(valueSelected).subscribe()}
      title="VIDEO SELECTION"
      subTitle="SELECT DESIRED VIDEO"
      actions={ACTIONS_CONFIRM}
    >
      <MButtonGroup
        options={video.list}
        value={valueSelected}
        onChange={(value) => setValueSelected(value)}
      />
    </Modal>
  );

  if (selection === SelectionTypes.Payment)
  return (
    <Modal
      show={true}
      cancel={cleanSelection}
      finish={() => payment.update(valueSelected).subscribe()}
      title="PAYMENT SELECTION"
      subTitle="SELECT FREE / PAID"
      actions={ACTIONS_CONFIRM}
    >
      <MButtonGroup
        options={payment.list}
        value={valueSelected}
        onChange={(value) => setValueSelected(value)}
      />
    </Modal>
  );

  if (selection === SelectionTypes.Language)
  return (
    <Modal
      show={true}
      cancel={cleanSelection}
      finish={() => language.update(valueSelected).subscribe()}
      title="SERVICE LANGUAGE"
      subTitle="SELECT DESIRED LANGUAGE"
      actions={ACTIONS_CONFIRM}
    >
      <MButtonGroup
        options={language.list}
        value={valueSelected}
        onChange={(value) => setValueSelected(value)}
      />
    </Modal>
  );
};