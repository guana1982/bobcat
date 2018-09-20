import { injectGlobal } from "styled-components";

injectGlobal`
  body {
    padding: 0;
    margin: 0;
    font-family: sans-serif;
  }
  #root {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
`;

export const theme1 = {
  primary: "#6e27c5",
  secondary: "#ffb617",
  danger: "#f16623",
  light: "#f4f4f4",
  dark: "#222"
};

export const theme2 = {
  primary: "#ff0198",
  secondary: "#01c1d6",
  danger: "#eb238e",
  light: "#f4f4f4",
  dark: "#222"
};