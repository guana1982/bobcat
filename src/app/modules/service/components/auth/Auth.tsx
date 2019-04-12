
import * as React from "react";
import { ConfigContext, ServiceContext, AuthLevels } from "@core/containers";
import { ModalKeyboard, ModalKeyboardTypes } from "../common/ModalKeyboard";
import { Pages } from "@core/utils/constants";
import { withRouter } from "react-router-dom";

interface AuthProps {
  history: any;
}

const AuthComponent = (props: AuthProps) => {
  const configConsumer = React.useContext(ConfigContext);
  const serviceConsumer = React.useContext(ServiceContext);

  const { authLevel, setAuthLevel } = serviceConsumer;
  const { authService, setAuthService } = configConsumer;

  const cancel = () => {
    setAuthService(false);
  };

  const finish = (output: string) => {
    if (output === "12345") {
      setAuthLevel(AuthLevels.Tech);
    } else if (output === "98765") {
      setAuthLevel(AuthLevels.Crew);
    } else if (output === "23456") {
      setAuthLevel(AuthLevels.Super);
    } else {
      return null;
    }
    props.history.push(Pages.Menu);
  };

  return (
    <>
    {authService && <ModalKeyboard title={"ENTER PIN"} type={ModalKeyboardTypes.Auth} cancel={cancel} finish={finish} />}
    </>
  );
};

export const Auth = withRouter(AuthComponent);