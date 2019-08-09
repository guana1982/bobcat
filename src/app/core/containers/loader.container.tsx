import * as React from "react";
import createUseContext from "constate";

const LoaderContainer = createUseContext(() => {

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

export const LoaderProvider = (props) => {
  const { children, loaderComponent } = props;
  return(
  <LoaderContainer.Provider>
    {children}
    {loaderComponent}
  </LoaderContainer.Provider>
  );
};

export const LoaderContext = LoaderContainer.Context;