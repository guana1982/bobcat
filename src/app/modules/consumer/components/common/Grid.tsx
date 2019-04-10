import * as React from "react";
import styled from "styled-components";

/* numElement?: number; */
export const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: auto;
  height: calc(100% - 150px);
  max-width: ${props => {
    switch (props.numElement) {
      case 5:
        return "900px";
        break;
      case 6:
        return "900px";
        break;
      default:
        return "1150px";
        break;
    }
  }};
`;