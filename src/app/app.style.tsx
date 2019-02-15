import { createGlobalStyle } from "styled-components";

export const themeMain = {
  primary: "#005BC3",
  secondary: "#E9F3FC",
  danger: "#f16623",
  light: "#EEF6FD",
  dark: "#222",
  sail: "#B3DAFA",
  spindle: "#b6ceef"
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

  @font-face {
    font-family: 'Karla';
    font-style: normal;
    font-weight: 400;
    src: local('Karla Regular'), local('Karla-Regular'),
        url('/fonts/Karla-Regular.ttf') format('truetype'), /* Safari, Android, iOS */
  }

  html,
  body {
    font-family: Karla, sans-serif;
    /* font-family: sans-serif; */
    font-weight: 300;
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

  *[disabled] {
    opacity: .5;
  }

  input {
    border: none;
    border-bottom: 1px solid #eee;
  }

  input::placeholder {
    color: #999;
  }
`;