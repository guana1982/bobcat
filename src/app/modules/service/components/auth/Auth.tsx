
import * as React from "react";
import { ConfigContext, ServiceContext, AuthLevels } from "@core/containers";
import { ModalKeyboard, ModalKeyboardTypes } from "../common/ModalKeyboard";
import { Pages } from "@core/utils/constants";
import { withRouter } from "react-router-dom";
import { Observable } from "rxjs";

interface AuthProps {
  history: any;
  authLogin: (data: any) => Observable<AuthLevels>;
  setAuthLevel: any;
}

const AuthComponent = (props: AuthProps) => {
  const configConsumer = React.useContext(ConfigContext);

  const { authService, setAuthService } = configConsumer;
  const { authLogin, setAuthLevel } = props;

  // React.useEffect(() => { // MOCK => START SERVICE UI
  //   setAuthLevel(AuthLevels.Super);
  //   props.history.push(Pages.Menu);
  //   return () => {};
  // }, []);

  const cancel = () => {
    setAuthService(false);
  };

  const finish = (output: string) => {
    authLogin(output)
    .subscribe(
      authLevel => props.history.push(Pages.Menu)
    );
  };

  return (
    <>
      {authService && <ModalKeyboard title={"ENTER PIN"} type={ModalKeyboardTypes.Auth} cancel={cancel} finish={finish} />}
    </>
  );
};

export const Auth = withRouter(AuthComponent);