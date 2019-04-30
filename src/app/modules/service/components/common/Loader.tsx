import * as React from "react";
import styled from "styled-components";
import Loader from "react-loader-spinner";
import { LoaderContext } from "@core/containers/loader.container";

const StyledLoader = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .5);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  z-index: 100000;
  & > div {
    width: 108px;
    margin: auto;
  }
`;

export const LoaderComponent = props => {
  const alertConsumer = React.useContext(LoaderContext);
  const {show, options} = alertConsumer.state;

  return (
    <React.Fragment>
    { show &&
        <StyledLoader>
          <Loader
            type="Oval"
            color="#BCBCBC"
            height="100"
            width="100"
          />
        </StyledLoader>
    }
    </React.Fragment>
  );
};