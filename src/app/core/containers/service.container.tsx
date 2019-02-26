import * as React from "react";
import createContainer from "constate";
import { ConfigContext } from "./config.container";

interface ServiceState {
  test: boolean;
}

const ServiceContainer = createContainer(() => {

  const [state, setState] = React.useState<ServiceState>({
    test: false
  });

  const configConsumer = React.useContext(ConfigContext);

  React.useEffect(() => {
    console.log("ServiceContainer => Config ;", configConsumer);
    return () => {
      console.log("close");
    };
  }, []);

  const testEvent = () => {
    setState(prevState => ({
      ...prevState,
      test: true
    }));
  };

  return { state, testEvent };
});

export const ServiceProvider = ServiceContainer.Provider;
export const ServiceContext = ServiceContainer.Context;