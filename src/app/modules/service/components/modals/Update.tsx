import * as React from "react";
import { Box, ModalContentProps, Modal, ACTIONS_CLOSE } from "../common/Modal";
import { MButton } from "../common/Button";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { LoaderContext } from "@core/containers/loader.container";
import { finalize } from "rxjs/operators";
import { __ } from "@core/utils/lib/i18n";
import { AlertContext, AuthLevels } from "@core/containers";
import { Subscription } from "rxjs";

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

let mediumLevelUpdate_: Subscription = null;

interface UpdateProps extends Partial<ModalContentProps> {
  authLevel: AuthLevels;
}

export const Update = (props: UpdateProps) => {
  const { cancel } = props;
  const loaderConsumer = React.useContext(LoaderContext);
  const alertConsumer = React.useContext(AlertContext);
  const [updateFrom, setUpdateFrom] = React.useState<UpdateFroms>(UpdateFroms.None);

  const update = (type: UpdateTypes) => {
    loaderConsumer.show();
    const mediumLevelUpdate = mediumLevel.updates[updateFrom === UpdateFroms.Server ? "updateRemoteServer" : "updateUsb"];
    mediumLevelUpdate_ = mediumLevelUpdate(type)
    .pipe(
      finalize(() => loaderConsumer.hide())
    )
    .subscribe(
      data => {
        if (data.error) {
          alertConsumer.show({
            timeout: true,
            title: "ERROR",
            content: __(data.error)
          });
        }
      }
    );
  };

  React.useEffect(() => {
    return () => {
      if (mediumLevelUpdate_) {
        mediumLevelUpdate_.unsubscribe();
      }
    };
  }, []);

  if (updateFrom === UpdateFroms.None)
  return (
    <Modal
      show={true}
      cancel={cancel}
      title="update"
      subTitle="select desired action"
      actions={ACTIONS_CLOSE}
    >
      <Box className="centered">
        <MButton onClick={() => setUpdateFrom(UpdateFroms.Usb)}>UPLOAD FROM USB</MButton>
        <MButton onClick={() => setUpdateFrom(UpdateFroms.Server)}>UPDATE FROM REMOTE SERVER</MButton>
      </Box>
    </Modal>
  );

  if (updateFrom === UpdateFroms.Usb)
  return (
    <Modal
      show={true}
      cancel={() => setUpdateFrom(UpdateFroms.None)}
      title="update from usb"
      subTitle="select desired action"
      actions={ACTIONS_CLOSE}
    >
      <Box className="centered">
        <MButton onClick={() => update(UpdateTypes.All)}>ALL</MButton>
        {props.authLevel === AuthLevels.Super && <MButton onClick={() => update(UpdateTypes.Planogram)}>PLANOGRAM</MButton>}
      </Box>
    </Modal>
  );

  if (updateFrom === UpdateFroms.Server)
  return (
    <Modal
      show={true}
      cancel={() => setUpdateFrom(UpdateFroms.None)}
      title="update from remote server"
      subTitle="select desired action"
      actions={ACTIONS_CLOSE}
    >
      <Box className="centered">
        <MButton onClick={() => update(UpdateTypes.Sw)}>FIRMWARE</MButton>
        <MButton onClick={() => update(UpdateTypes.Planogram)}>PLANOGRAM</MButton>
        <MButton onClick={() => update(UpdateTypes.Video)}>ATTRACT LOOP</MButton>
        <MButton onClick={() => update(UpdateTypes.All)}>ALL</MButton>
      </Box>
    </Modal>
  );
};