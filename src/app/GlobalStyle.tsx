import { createGlobalStyle } from "styled-components";

const KarlaReg = "fonts/KarlaReg.ttf";
const KarlaBol = "fonts/KarlaBol.ttf";

const NeuzeitGroReg = "fonts/NeuzeitGroReg.otf";
const NeuzeitGroBol = "fonts/NeuzeitGroBol.otf";

export const themeMain = {
  primary: "#005BC3",
  secondary: "#E9F3FC",
  danger: "#f16623",
  light: "#EEF6FD",
  dark: "#222",
  sail: "#B3DAFA",
  spindle: "#b6ceef",

  grey: "rgba(241, 241, 241, .6)",
  slateGrey: "#565657",
  arcticGrey: "#f5f5f5",
  backgroundLight: "linear-gradient(to bottom, #fff, #f9f9f9)"
};

export const themeMenu = {
  primary: "#E7E7E7",
  secondary: "#D9D9D9",
  danger: "#D60000",
  warning: "#FAD201",
  success: "#009933",
  light: "#FCFCFC",
  dark: "#383838"
};

export const GlobalStyle = createGlobalStyle`
  html {
    cursor: none;
  }
  /* // => DESKTOP MODE */

  @font-face {
    font-family: Karla-Reg;
    src: url(${KarlaReg})
  }

  @font-face {
    font-family: Karla-Bol;
    src: url(${KarlaBol})
  }

  @font-face {
    font-family: NeuzeitGro-Reg;
    src: url(${NeuzeitGroReg})
  }

  @font-face {
    font-family: NeuzeitGro-Bol;
    src: url(${NeuzeitGroBol})
  }

  html,
  body {
    font-family: NeuzeitGro-Reg;
    /* font-weight: 300; */
    letter-spacing: 0.025em;
    line-height: 1.4;
    font-size: 15px;
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
    color: #555;
    overflow: hidden;
    /* -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale; */

    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none;   /* Chrome/Safari/Opera */
    -khtml-user-select: none;    /* Konqueror */
    -moz-user-select: none;      /* Firefox */
    -ms-user-select: none;       /* Internet Explorer/Edge*/
    user-select: none;
  }

  * {
    box-sizing: border-box;
  }

  #root {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  section {
    height: 100%;
    width: 100%;
  }

  button {
    font-family: inherit;
    font-weight: inherit;
    color: inherit;
    background: transparent;
    border: none;
    outline: none;
    opacity: 1;
    margin: 0;
    padding: 0;
  }

  img {
    max-width: 100%;
  }

  :global #root {
    width: 100%;
    height: 100%;
    background: #fff;
  }

  /* *[disabled] {
    opacity: .5;
  } */

  input {
    border: none;
    border-bottom: 1px solid #eee;
  }

  input::placeholder {
    color: #999;
  }

  button[disabled] {
    opacity: 1;
  }
  body.accessibility-enable {
    button:focus {
      box-shadow: 0 0 0 6px #2b9cda;
    }
  }
`;