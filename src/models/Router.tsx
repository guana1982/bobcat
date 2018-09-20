import * as React from "react";
import * as Loadable from "react-loadable";

// import ScreenSaver from "../layout/ScreenSaver";
// import { Attractor, Home } from "../layout";

const LoadableScreenSaver = Loadable({
  loader: () => import("../layout/ScreenSaver"),
  loading: () => <div>loading ...</div>
});

const LoadableHome = Loadable({
  loader: () => import("../layout/Home"),
  loading: () => <div>loading ...</div>
});

const LoadableAttractor = Loadable({
  loader: () => import("../layout/Attractor"),
  loading: () => <div>loading ...</div>
});

const initialState = "SCREENSAVER";

const PAGES = {
  SCREENSAVER: <LoadableScreenSaver />,
  HOME: <LoadableHome />,
  ATTRACTOR: <LoadableAttractor />,
};

interface RouterInterface {
  currentState: string;
  setPage: (newState: string) => void;
  getPage: () => JSX.Element;
}

const RouterContext = React.createContext<RouterInterface | null>(null);

export const RouterProvider = RouterContext.Provider;
export const RouterConsumer = RouterContext.Consumer;

export class RouterStore extends React.Component<any, any> {

  constructor(props) {
    super(props);

    this.state = {
      PAGES: PAGES,
      currentState: initialState,
    };
  }

  setPage = (newState: string) => {
    this.setState({ currentState: newState });
  }

  getPage = () => {
    return this.state.PAGES[this.state.currentState];
  }

  render() {
    const { children } = this.props;
    return (
      <RouterProvider
        value={{
          currentState: this.state.currentState,
          setPage: this.setPage,
          getPage: this.getPage
        }}
      >
        {children}
      </RouterProvider>
    );
  }
}

export const Route = (props) => {
  return (
    <RouterConsumer>
      {({getPage, currentState}) => getPage()}
    </RouterConsumer>
  );
};