
import * as React from "react";
import { ConfigContext, ServiceContext, AuthLevels, AlertContext } from "@core/containers";
import { ModalKeyboard, ModalKeyboardTypes } from "../common/ModalKeyboard";
import { Pages } from "@core/utils/constants";
import { withRouter } from "react-router-dom";
import { Observable } from "rxjs";
import { __ } from "@core/utils/lib/i18n";
import { finalize } from "rxjs/operators";
import { LoaderContext } from "@core/containers/loader.container";

interface AuthProps {
  history: any;
  authLogin: (data: any) => Observable<AuthLevels>;
  setAuthLevel: any;
}

const AuthComponent = (props: AuthProps) => {
  const configConsumer = React.useContext(ConfigContext);

  const { authService, setAuthService } = configConsumer;
  const alertConsumer = React.useContext(AlertContext);
  const loaderConsumer = React.useContext(LoaderContext);

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
    loaderConsumer.show();
    authLogin(output)
    .pipe(
      finalize(() => loaderConsumer.hide())
    )
    .subscribe(
      authLevel => props.history.push(Pages.Menu),
      error => {
        alertConsumer.show({
          title: "WARNING",
          content: __(error),
          onDismiss: () => {
            setAuthService(true);
          }
        });
      }
    );
  };

  return (
    <>
      {authService && <ModalKeyboard title={"ENTER PIN"} type={ModalKeyboardTypes.Auth} cancel={cancel} finish={finish} />}
    </>
  );
};

export const Auth = withRouter(AuthComponent);