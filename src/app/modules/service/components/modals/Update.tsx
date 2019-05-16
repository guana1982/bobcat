import * as React from "react";
import { Box, ModalContentProps, Modal, ACTIONS_CLOSE } from "../common/Modal";
import { MButton } from "../common/Button";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { LoaderContext } from "@core/containers/loader.container";
import { finalize } from "rxjs/operators";
import { __ } from "@core/utils/lib/i18n";

enum UpdateFroms {
  None = "none",
  Usb = "usb",
  Server = "server"
}

enum UpdateTypes {
  All = "ALL",
  Sw = "SW",
  Planogram = "PLANOGRAM",
  Video = "VIDEO"
}

interface UpdateProps extends Partial<ModalContentProps> {}

export const Update = (props: UpdateProps) => {
  const { cancel } = props;
  const loaderConsumer = React.useContext(LoaderContext);
  const [updateFrom, setUpdateFrom] = React.useState<UpdateFroms>(UpdateFroms.None);

  const update = (type: UpdateTypes) => {
    loaderConsumer.show();
    const mediumLevelUpdate = mediumLevel.updates[updateFrom === UpdateFroms.Server ? "updateRemoteServer" : "updateUsb"];
    mediumLevelUpdate(type)
    .pipe(
      finalize(() => loaderConsumer.hide())
    )
    .subscribe();
  };

  if (updateFrom === UpdateFroms.None)
  return (
    <Modal
      show={true}
      cancel={cancel}
      title={__("s_update")}
      subTitle={__("s_select_action")}
      actions={ACTIONS_CLOSE}
    >
      <Box className="centered">
        <MButton onClick={() => setUpdateFrom(UpdateFroms.Usb)}>{__("s_update_from_usb")}</MButton>
        <MButton onClick={() => setUpdateFrom(UpdateFroms.Server)}>{__("s_update_from_server")}</MButton>
      </Box>
    </Modal>
  );

  if (updateFrom === UpdateFroms.Usb)
  return (
    <Modal
      show={true}
      cancel={() => setUpdateFrom(UpdateFroms.None)}
      title={__("s_update_from_usb")}
      subTitle={__("s_select_action")}
      actions={ACTIONS_CLOSE}
    >
      <Box className="centered">
        <MButton onClick={() => update(UpdateTypes.All)}>{__("s_update_all")}</MButton>
      </Box>
    </Modal>
  );

  if (updateFrom === UpdateFroms.Server)
  return (
    <Modal
      show={true}
      cancel={() => setUpdateFrom(UpdateFroms.None)}
      title={__("s_update_from_server")}
      subTitle={__("s_select_action")}
      actions={ACTIONS_CLOSE}
    >
      <Box className="centered">
        <MButton onClick={() => update(UpdateTypes.Sw)}>{__("s_firmware")}</MButton>
        <MButton onClick={() => update(UpdateTypes.Planogram)}>{__("s_update_planogram")}</MButton>
        <MButton onClick={() => update(UpdateTypes.Video)}>{__("s_update_attract_loop")}</MButton>
        <MButton onClick={() => update(UpdateTypes.All)}>{__("s_update_all")}</MButton>
      </Box>
    </Modal>
  );
};