import * as React from "react";
import { compose, lifecycle } from "recompose";
import Vendor from "../VendorComponents";

import { Attractor, Home } from "../layout";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";


import { ThemeProvider } from "styled-components";
import { theme1, theme2 } from "../style/globalStyle";
import { ConfigStore, ConfigConsumer } from "../models";

const fullScreen = compose(
  lifecycle({
    componentDidMount() {
      document.body.webkitRequestFullScreen();
    },
    componentDidCatch(err) {
      console.log("!!!!! catch", err);
    }
  }),
);

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>Rendering with React</Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic} />
    <Route
      exact
      path={match.url}
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
);

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
);

export default fullScreen(({
  isLoadingNetwork,
  error,
  getConfigState,
  ...props
}) => {
  return (
    <ThemeProvider theme={theme1}>
      <ConfigStore>
        <Router>
          <div>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/attractor">Attractor</Link>
              </li>
              <li>
                <Link to="/topics">Topics</Link>
              </li>
            </ul>

            <ConfigConsumer>
              {({ isLit }) => (
                <div className={`room ${isLit ? "lit" : "dark"}`}>
                  The room is {isLit ? "lit" : "dark"}.
                </div>
              )}
            </ConfigConsumer>

            <hr />

            <Route exact path="/" component={Home} />
            <Route path="/attractor" component={Attractor} />
            <Route path="/topics" component={Topics} />
          </div>
        </Router>
      </ConfigStore>
    </ThemeProvider>
  );
});
