import * as React from "react";
import { __ } from "@utils/lib/i18n";
import styled from "styled-components";
import { ButtonGroup } from "../global/ButtonGroup";
import { EndBeverage } from "./EndBeverage";
import { AccessibilityContext, ConfigContext } from "@core/containers";
import ReactDOM = require("react-dom");
import { CloseBtn, CloseBtnWrap } from "../global/CloseBtn";
import { BeverageTypes } from "../global/Beverage";

const _sizePour = 105;

export const Pour = styled.button`
  position: absolute;
  bottom: 0; /* ${-_sizePour / 5}px; */
  line-height: 6;
  right: calc(50% - ${_sizePour}px);
  height: ${_sizePour}px;
  width: ${_sizePour * 2}px;
  border-top-left-radius: ${_sizePour * 2}px;
  border-top-right-radius: ${_sizePour * 2}px;
  font-size: ${_sizePour / 5}px;
  font-weight: 600;
  opacity: ${props => props.isPouring ? .7 : 1};
  &, &:active {
    color: ${props => props.theme.light};
    background: ${props => props.theme.slateGrey};
  }
`;

/* ==== CARDS ==== */
/* ======================================== */

export const InfoCard = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgb(166, 202, 237);
  color: rgb(37, 107, 192);
  text-align: center;
  width: 14rem;
  height: 27rem;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  padding: 15px;
  border: 1px solid ${props => props.theme.primary};
  &.right {
    left: calc(15% - 6.5rem);
  }
  &.left {
    right: calc(15% - 6.5rem);
    footer {
      padding-top: 0rem;
    }
  }
  header {
    min-height: 9rem;
  }
  aside {
    display: flex;
    justify-content: center;
    min-height: 10rem;
    img {
      height: 10rem;
    }
  }
  footer {
    padding-top: 1rem;
    min-height: 8rem
  }
  h3 {
    font-size: 1.6rem;
    font-weight: 600;
  }
  h2 {
    font-size: 1.9rem;
    font-weight: 600;
    margin: 0;
  }
  h4 {
    font-size: 1.3rem;
    font-weight: 500;
    margin: 0;
  }
`;

/* CLASS => type?: string; */
export const CustomizeBeverageCard = styled.div`
  position: absolute;
  bottom: 132px;
  width: 550px;
  height: 598px;
  border-radius: 0 0 20px 20px;
  left: 50%;
  transform: translateX(-50%);
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.96) 50%, #fff);
  &.${BeverageTypes.Sparkling} #logo-sparkling {
    display: block;
  }
  &:not(.${BeverageTypes.Sparkling}) #logo {
    display: block;
  }
  #logo, #logo-sparkling {
    position: absolute;
    display: none;
    top: 5px;
    left: 122.5px;
    width: 305px;
    height: 308px;
  }
  #title {
    position: absolute;
    left: 26.5px;
    bottom: 263px;
    width: 278px;
    font-size: 28px;
    text-transform: uppercase;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.11;
    letter-spacing: 4.9px;
    color: ${props => props.theme.slateGrey};
  }
  #cal {
    position: absolute;
    left: 26.5px;
    bottom: 234px;
    width: 84px;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 1.1px;
    color: ${props => props.theme.slateGrey};
  }
  #group {
    position: absolute;
    top: 370px;
  }
`;

/* ==== WRAPPER ==== */
/* ======================================== */

export const CustomizeBeverageWrap = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  #backdrop {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f9f9f9;
    opacity: 0.4;
  }
  ${CloseBtnWrap} {
    position: absolute;
    top: 26.5px;
    right: 27px;
  }
`;

/* ==== ELEMENT ==== */
/* ======================================== */

interface CustomizeBeverageProps {
  levels: any;
  isSparkling: boolean;
  slideOpen: boolean;
  showCardsInfo: boolean;
  showEnd: boolean;
  beverageConfig: any;
  resetBeverage: any;
  getBeverageSelected: any;
  handleChange: any;
  startPour: any;
  stopPour: any;
}

export const CustomizeBeverage = (props: CustomizeBeverageProps) => {
  const { slideOpen, showCardsInfo, showEnd, beverageConfig, isSparkling, startPour, stopPour, levels, resetBeverage, getBeverageSelected, handleChange } = props;

  //  ==== ACCESSIBILITY FUNCTION ====>
  const buttonPourEl = React.useRef(null);
  const accessibilityConsumer = React.useContext(AccessibilityContext);
  const configConsumer = React.useContext(ConfigContext);
  const { pour, enter } = accessibilityConsumer;

  const { isPouring } = configConsumer;

  React.useEffect(() => {
    const button = buttonPourEl.current;
    const isFocus = document.activeElement === ReactDOM.findDOMNode(button);
    if (!isPouring) {
      if (pour === true || enter === true && isFocus) {
        startPour();
      }
    } else {
      if (pour === false || enter === false && isFocus) {
        stopPour();
      }
    }
  }, [pour, buttonPourEl, enter]);
  //  <=== ACCESSIBILITY FUNCTION ====

  const beverageSelected = getBeverageSelected();

  return(
    <React.Fragment>
      <CustomizeBeverageWrap>
        <CloseBtn detectValue={"beverage_close"} icon={"close"} onClick={() => resetBeverage()} />

        <div id="backdrop"></div> {/* onClick={() => resetBeverage()} */}

        {/* {showCardsInfo && <InfoCard className={"right"}>
          <header>
            <h3>Sign-up to track your hydration</h3>
          </header>
          <aside>
            <img src={"icons/smartphone.svg"} />
          </aside>
          <footer>
            <h4>Now available in App Stores</h4>
          </footer>
        </InfoCard>} */}

        <CustomizeBeverageCard className={isSparkling ? BeverageTypes.Sparkling : null}>
            <img id="logo" src={`img/logos/${beverageSelected.beverage_logo_id}.png`} />
            <img id="logo-sparkling" src={`img/logos/${beverageSelected.beverage_logo_id}@sparkling.png`} />
            <span id="title">{__(beverageSelected.beverage_label_id)}</span>
            <span id="cal">0 CAL.</span>
            <div id="group">
              {beverageConfig.carbonation_level != null &&
                <ButtonGroup
                  detectValue={"sparkling"}
                  icon={"sparkling"}
                  label={"Sparkling"}
                  options={levels.carbonation}
                  value={beverageConfig.carbonation_level}
                  onChange={(value) => handleChange(value, "carbonation")}>
                </ButtonGroup>
              }
              {beverageConfig.flavor_level != null &&
                <ButtonGroup
                  detectValue={"flavor"}
                  icon={"flavor"}
                  label={"Flavor"}
                  options={levels.flavor}
                  value={beverageConfig.flavor_level}
                  onChange={(value) => handleChange(value, "flavor")}
                ></ButtonGroup>
              }
              <ButtonGroup
                detectValue={"temperature"}
                icon={"temperature"}
                label={"Coldness"}
                disabled={isSparkling}
                options={levels.temperature}
                value={beverageConfig.temperature_level}
                onChange={(value) => handleChange(value, "temperature")}>
              </ButtonGroup>
            </div>
        </CustomizeBeverageCard>

        {/* {showCardsInfo && <InfoCard className={"left"}>
          <header>
            <h3>This office<br/> saved</h3>
          </header>
          <aside>
            <img src={"icons/bottle.svg"} />
          </aside>
          <footer>
            <h2>239</h2>
            <h4>Plastic Bottles</h4>
          </footer>
        </InfoCard>} */}

        <Pour isPouring={isPouring} ref={buttonPourEl} onTouchStart={() => startPour()} onTouchEnd={() => stopPour()}>Hold to Pour</Pour>
      </CustomizeBeverageWrap>

      {showEnd && <EndBeverage resetBeverage={resetBeverage} />}
    </React.Fragment>
  );
};