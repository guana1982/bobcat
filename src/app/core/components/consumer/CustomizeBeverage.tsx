import * as React from "react";
import { __ } from "@utils/lib/i18n";
import { CircleBtnContent, CircleBtn } from "../global/CircleBtn";
import styled from "styled-components";
import { FocusElm } from "@containers/index";
import { ButtonGroupBorder } from "../global/ButtonGroup";
import { EndBeverage } from "./EndBeverage";

const _sizePour = 280;
/* title?: string */
export const Pour = styled.button.attrs(props => ({
  "data-btn-focus": props.dataBtnFocus
}))`
  position: absolute;
  bottom: ${-_sizePour / 1.6}px;
  right: calc(50% - ${_sizePour}px);
  height: ${_sizePour}px;
  width: ${_sizePour * 2}px;
  border-top-left-radius: ${_sizePour * 2}px;
  border-top-right-radius: ${_sizePour * 2}px;
  font-size: ${_sizePour / 15}px;
  box-shadow: 0px 0px 18px -1px rgba(0,0,0,0.2);
  font-weight: 600;
  text-transform: uppercase;
  &:before {
    position: absolute;
    top: 20%;
    transform: translate(-50%, -50%);
    text-align: center;
    content: "${props => props.title}";
  }
  &, &:active {
    background: ${props => props.theme.light};
    color: ${props => props.theme.dark};
  }
  &:active {
    opacity: .75;
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

const _sizeBeverageCard = 410;
/* type?: string; */
export const CustomizeBeverageCard = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  left: calc(50% - ${_sizeBeverageCard / 2}px);
  background-color: ${props => props.theme.light};
  border: 1px solid ${props => props.theme.primary};
  border-radius: 15px;
  width: ${_sizeBeverageCard}px;
  padding: 10px;
  min-height: ${_sizeBeverageCard * 1.2}px;
  header {
    position: relative;
    padding: 1rem;
    &:before {
      content: " ";
      opacity: .7;
      position: absolute;
      left: calc(50% - 8rem);
      top: 20%;
      width: 100%;
      max-width: 16rem;
      height: 100%;
      background-repeat: no-repeat;
      background-image: url("img/${props => props.type}.svg");
    }
    h2 {
      position: relative;
      padding-top: 2rem;
      font-size: 3rem;
      margin: .5rem;
      color: ${props => props.theme.primary };
      &:before {
        position: absolute;
        content: "${props => props.type} ";
        font-size: 1.8rem;
        top: 0;
        display: block;
        text-transform: uppercase;
        font-weight: 400;
      }
    }
    h6 {
      position: relative;
      font-size: 1rem;
      left: .7rem;
      margin: 0;
      color: ${props => props.theme.primary };
    }
  }
  aside {
    min-height: 246px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 1rem;
  }
`;

/* ==== WRAPPER ==== */
/* ======================================== */
/* beverage_logo_id?: any */
export const CustomizeBeverageWrap = styled.section.attrs(props => ({
  "data-focus": props.dataFocus
}))`
  position: absolute;
  top: 0;
  left: 0;
  /* height: 100vh;
  width: 75vw; */
  #backdrop {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("img/logos/2009_large.png"); /* url("img/logos/${props => props.beverage_logo_id}_large.png"); */
    background-color: rgba(240, 240, 240, .7);
    background-repeat: no-repeat;
    background-size: contain;
    /* background: rgba(0, 91, 195, .6); */
  }
  ${CircleBtnContent} {
    position: absolute;
    right: 30px;
    top: 30px;
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
  const beverage = getBeverageSelected();
  return(
    <React.Fragment>
      <CustomizeBeverageWrap beverage_logo_id={beverage.beverage_logo_id} dataFocus={!slideOpen ? FocusElm.Controller : null}>
        <CircleBtn onClick={() => resetBeverage()} bgColor={"primary"} color={"light"} icon={"icons/cancel.svg"} />
        <div id="backdrop" onClick={() => resetBeverage()}></div>
        {showCardsInfo && <InfoCard className={"right"}>
          <header>
            <h3>Sign-up to track your hydration</h3>
          </header>
          <aside>
            <img src={"icons/smartphone.svg"} />
          </aside>
          <footer>
            <h4>Now available in App Stores</h4>
          </footer>
        </InfoCard>}
        <CustomizeBeverageCard type={isSparkling ? "sparkling" : null}>
          <header>
            <h2>{__(beverage.beverage_label_id)}</h2>
            <h6>0-CALS</h6>
          </header>
          <aside>
            {beverageConfig.flavor_level != null &&
              <ButtonGroupBorder
                label={"Flavor"}
                options={levels.flavor}
                value={beverageConfig.flavor_level}
                onChange={(value) => handleChange(value, "flavor")}
              ></ButtonGroupBorder>
            }
            {beverageConfig.carbonation_level != null &&
              <ButtonGroupBorder
                label={"Sparkling"}
                options={levels.carbonation}
                value={beverageConfig.carbonation_level}
                onChange={(value) => handleChange(value, "carbonation")}>
              </ButtonGroupBorder>
            }
            <ButtonGroupBorder
              label={"Temp"}
              options={isSparkling ? levels.carbTemperature : levels.temperature}
              value={beverageConfig.temperature_level}
              onChange={(value) => handleChange(value, "temperature")}>
            </ButtonGroupBorder>
          </aside>
          {/* <div>
            <button type="button">add b-complex</button>
            <button type="button">add antioxidants</button>
          </div> */}
        </CustomizeBeverageCard>
        {showCardsInfo && <InfoCard className={"left"}>
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
        </InfoCard>}
        <Pour dataBtnFocus={FocusElm.Init} onTouchStart={() => startPour()} title={__("pour")} onTouchEnd={() => stopPour()}></Pour>
      </CustomizeBeverageWrap>
      {showEnd && <EndBeverage resetBeverage={resetBeverage} />}
    </React.Fragment>
  );
};