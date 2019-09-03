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

  body::after{
    position:absolute; width:0; height:0; overflow:hidden; z-index:-1;
    content:
      url("img/fruits-bg.webp")
      url("img/phone-qr.svg")
      url("img/bottle-qr.svg")
      url("img/scan-qr-code-tip.svg")
      url("img/out-of-order.svg")

      url("img/alerts/cannot-connect-to-cloud.svg")
      url("img/alerts/pay.svg")
      url("img/alerts/qr-code-not-recognized.svg")
      url("img/alerts/static-loading-icon.webp")
      url("img/alerts/payment_system_down.webp")
      url("img/alerts/qr-code-not-associated-with-account.webp")
      url("img/alerts/wrench.webp")
      url("img/alerts/daily-limit-reached.webp")
      url("img/alerts/ada-down.webp")

      url("img/drawer/drawer.webp")
      url("img/drawer/favorite.webp")
      url("img/drawer/favorite@blur.webp")
      url("img/drawer/last_pour.webp")
      url("img/drawer/last_pour@blur.webp")

      url("img/logos/9/logo.webp")
      url("img/logos/10/logo.webp")
      url("img/logos/2009/logo.webp")
      url("img/logos/2011/logo.webp")
      url("img/logos/2012/logo.webp")
      url("img/logos/2013/logo.webp")
      url("img/logos/2014/logo.webp")
      url("img/logos/2015/logo.webp")

      url("img/logos/9/logo@2x.webp")
      url("img/logos/10/logo@2x.webp")
      url("img/logos/2009/logo@2x.webp")
      url("img/logos/2011/logo@2x.webp")
      url("img/logos/2012/logo@2x.webp")
      url("img/logos/2013/logo@2x.webp")
      url("img/logos/2014/logo@2x.webp")
      url("img/logos/2015/logo@2x.webp")

      url("img/logos/9/logo-sparkling.webp")
      url("img/logos/10/logo-sparkling.webp")
      url("img/logos/2009/logo-sparkling.webp")
      url("img/logos/2011/logo-sparkling.webp")
      url("img/logos/2012/logo-sparkling.webp")
      url("img/logos/2013/logo-sparkling.webp")
      url("img/logos/2014/logo-sparkling.webp")
      url("img/logos/2015/logo-sparkling.webp")

      url("img/logos/9/logo-sparkling@2x.webp")
      url("img/logos/10/logo-sparkling@2x.webp")
      url("img/logos/2009/logo-sparkling@2x.webp")
      url("img/logos/2011/logo-sparkling@2x.webp")
      url("img/logos/2012/logo-sparkling@2x.webp")
      url("img/logos/2013/logo-sparkling@2x.webp")
      url("img/logos/2014/logo-sparkling@2x.webp")
      url("img/logos/2015/logo-sparkling@2x.webp")

      url("img/logos/9/blur.webp")
      url("img/logos/10/blur.webp")
      url("img/logos/2009/blur.webp")
      url("img/logos/2011/blur.webp")
      url("img/logos/2012/blur.webp")
      url("img/logos/2013/blur.webp")
      url("img/logos/2014/blur.webp")
      url("img/logos/2015/blur.webp")

      url("img/logos/9/nutrition-blur.webp")
      url("img/logos/10/nutrition-blur.webp")
      url("img/logos/2009/nutrition-blur.webp")
      url("img/logos/2011/nutrition-blur.webp")
      url("img/logos/2012/nutrition-blur.webp")
      url("img/logos/2013/nutrition-blur.webp")
      url("img/logos/2014/nutrition-blur.webp")
      url("img/logos/2015/nutrition-blur.webp")

      url("icons/android-pay.svg")
      url("icons/apple-pay.webp")
      url("icons/arrow-circle.webp")
      url("icons/back.svg")
      url("icons/cancel.svg")
      url("icons/close.svg")
      url("icons/credit-card.svg")
      url("icons/crew.svg")
      url("icons/down.svg")
      url("icons/favorite.svg")
      url("icons/flavor.svg")
      url("icons/gift.svg")
      url("icons/info.svg")
      url("icons/last_pour.svg")
      url("icons/left.svg")
      url("icons/log-out.svg")
      url("icons/nutrition.svg")
      url("icons/qr-code.svg")
      url("icons/samsung-pay.webp")
      url("icons/sparkling.svg")
      url("icons/still.svg")
      url("icons/tech.svg")
      url("icons/temperature.svg")
      url("icons/up.svg")
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