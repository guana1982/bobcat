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
    background: lightgray;
  }
  section {
    height: 100%;
    width: 100%;
  }
`;

export const theme1 = {
  primary: "#005BC3",
  secondary: "#E9F3FC",
  danger: "#f16623",
  light: "#EEF6FD",
  dark: "#222",
  sail: "#B3DAFA"
};

export const theme2 = {
  primary: "#ff0198",
  secondary: "#01c1d6",
  danger: "#eb238e",
  light: "#f4f4f4",
  dark: "#222"
};