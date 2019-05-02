import * as React from "react";
import { AlertContext } from "@core/containers";
import { Modal, ModalTheme, ACTIONS_CLOSE, ACTIONS_CONFIRM } from "./Modal";

export const Alert = (props) => {

  const alertConsumer = React.useContext(AlertContext);

  const { show, options } = alertConsumer.state;

  const dismiss_ = () => {
    if (options.onDismiss) {
      options.onDismiss();
    }
    alertConsumer.hide();
  };

  const finish_ = () => {
    if (options.onConfirm) {
      options.onConfirm();
    }
    alertConsumer.hide();
  };

  return (
    <>
      {show &&
        <Modal
          themeMode={ModalTheme.Dark}
          show={true}
          cancel={dismiss_}
          finish={finish_}
          title={options.title || "ALERT"}
          actions={options.onConfirm ? ACTIONS_CONFIRM : ACTIONS_CLOSE}
        >
          <h3>{options.content}</h3>
        </Modal>
      }
    </>
  );
};