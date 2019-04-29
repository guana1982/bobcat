import * as React from "react";
import createContainer from "constate";


// export interface AlertOptions {
//   type?: AlertTypes;
//   timeout?: boolean | number;
//   onDismiss?: () => void;
// }

// interface AlertState {
//   show: boolean;
//   options?: AlertOptions;
// }

const LoaderContainer = createContainer(() => {

  const [state, setState] = React.useState({
    show: false,
    options: {}
  });

  const show = (options?) => {
    setState({
      show: true,
      options: options
    });
  };

  const hide = () => {
    setState({
      show: false,
      options: {}
    });
  };

  return { state, show, hide };
});

// interface AlertProviderProps {
//   children?: any;
//   alertComponent: any;
// }

export const LoaderProvider = (props) => {
  const { children, loaderComponent } = props;
  return(
  <LoaderContainer.Provider>
    {children}
    {loaderComponent}
  </LoaderContainer.Provider>
  );
};

// export const withAlert = Comp => props => {
//   const alert = React.useContext(AlertContext);
//   return (
//     <Comp {...props} alertConsumer={alert}></Comp>
//   );
// };

export const LoaderContext = LoaderContainer.Context;