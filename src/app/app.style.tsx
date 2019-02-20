import { createGlobalStyle } from "styled-components";

export const themeMain = {
  primary: "#545457",
  secondary: "#F9F9F9",
  danger: "#f16623",
  light: "#fff",
  mediumLight: "#FDFDFD",
  darkLight: "#DBDBDB",
  dark: "#222",
  sail: "#E7E7E7",
  lightSail: "#F4F4F4",
  darkSail: "#B4B4B4",
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

  /* -- Karla -- */
  @font-face {
    font-family: 'Karla';
    font-style: normal;
    font-weight: 400;
    src: local('Karla Regular'), local('Karla-Regular'),
        url('/fonts/Karla/Karla-Regular.ttf') format('truetype'),
  }

  /* -- Poppins -- */
  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    src: local('Poppins Medium'), local('Poppins-Medium'), url('/fonts/Poppins/Poppins-Medium.ttf') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  html,
  body {
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
    /* font-family: sans-serif; */
    /* font-family: Karla, sans-serif; */
    font-family: 'Poppins', sans-serif;
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