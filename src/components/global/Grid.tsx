import * as React from "react";
import styled from "styled-components";

interface GridProps { numElement?: number; }
export const Grid = styled<GridProps, "div">("div")`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: auto;
  max-width: ${props => {
    switch (props.numElement) {
      case 4:
        return "600px";
        break;
      case 5:
        return "900px";
        break;
      case 6:
      default:
        return "1150px";
        break;
    }
  }};
`;