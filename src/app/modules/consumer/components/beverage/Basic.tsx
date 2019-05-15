import * as React from "react";
import { __ } from "@utils/lib/i18n";
import styled, { css } from "styled-components";
import { BeverageTypes } from "./Beverage";
import { Logo } from "./Logo";
import { IBeverage } from "@core/models";
import { ILevelsModel } from "@core/utils/APIModel";

interface BasicProps {
  className: any;
  show: boolean;
  logoId?: any;
  types: BeverageTypes[];
  specialCard: any;
  title: any;
  levels: ILevelsModel;
  calories: string;
  beverage: IBeverage;
  slideOpen?: boolean;
  $sparkling?: boolean;
}

export const Basic_ = (props: BasicProps) => {
  const { className, types, specialCard, title, levels, slideOpen, $sparkling, logoId } = props;

  if (!props.show)
    return null;

  const sparkling_ = (types && types[0] === BeverageTypes.Sparkling) || $sparkling; // <= CONDITION

  return (
    <div className={className}>
        {(specialCard) &&
          <SpecialSection>
            <div id="types">
              {types.map((type, i) => <LabelIndicator tiny={types.length > 1 || !slideOpen} key={i}><img src={`icons/${type}.svg`} /><span>{__('c_' + type)}</span></LabelIndicator>)}
            </div>
            <div id="levels">
              {levels.carbonation_perc != null &&
                <LevelIndicator level={levels.carbonation_perc}>
                  <img src={`icons/${"sparkling"}.svg`} />
                  <div className="value" />
                </LevelIndicator>
              }
              <LevelIndicator level={levels.flavor_perc}>
                <img src={`icons/${"flavor"}.svg`} />
                <div className="value" />
              </LevelIndicator>
              <LevelIndicator level={levels.temperature_perc}>
                <img src={`icons/${"temperature"}.svg`} />
                <div className="value" />
              </LevelIndicator>
            </div>
          </SpecialSection>
        }
        <Logo {...props} />
        <span id="title">{__(logoId === 9 ? (sparkling_ ? __("sparkling_water") : __("pure_water")) : __(title))}</span>
        <span id="cal">0 Cal.</span> {/* {beverage.calories} */}
        {/* <span id="price">75¢</span> */}
    </div>
  );
};


export const LabelIndicator = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 18.1px;
    border-radius: 9px;
    ${({ tiny }) => tiny && css`
      width: 20px;
      height: 20px;
      border-radius: 11.4px;
      img {
        margin-right: 0 !important;
      }
      span {
        display: none;
      }
    `}
    img {
      width: 10px;
      height: 10px;
      margin-right: 3px;
    }
    span {
      text-transform: lowercase;
      font-size: 12px;
      height: 11px;
      color: #fff;
    }
    &:nth-child(2) {
      top: 40px !important;
    }
`;

export const LevelIndicator = styled.div`
  width: 34px;
  height: 35px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
  }
  .value {
    position: relative;
    width: 30px;
    height: 3px;
    border-radius: 1.5px;
    background-color: rgba(84, 84, 87, 0.21);
    &:before {
      content: "";
      height: 3px;
      border-radius: 1.5px;
      width: ${props => props.level}%;
      position: absolute;
      top: 0;
      left: 0;
      background: red;
    }
  }
`;

export const SpecialSection = styled.div`
  #types {
    position: absolute;
    display: flex;
    left: 18px;
    top: 20px;
    ${LabelIndicator} {
      margin-right: 5px;
    }
  }
  #levels {
    position: absolute;
    top: 48px;
    left: 18px;
  }
`;

export const Basic = styled<BasicProps>(Basic_)`
  position: relative;
  width: 100%;
  height: 100%;
  color: ${props => props.theme.slateGrey};
  text-transform: uppercase;
  ${LabelIndicator}, ${LevelIndicator} .value:before {
    background: ${props => props.color};
  }
  &>#title {
    position: absolute;
    font-family: NeuzeitGro-Bol;
    color: ${props => props.color};
    width: calc(100% - 46px);
    right: 23px;
    bottom: 43px;
    font-size: 18px;
    line-height: 1.1;
    letter-spacing: 3.2px;
    text-align: left;
  }
  &>#cal {
    position: absolute;
    left: 23px;
    bottom: 14px;
    font-size: 14px;
    letter-spacing: 1px;
    text-align: left;
  }
  &>#price {
    position: absolute;
    right: 23px;
    bottom: 14px;
    font-size: 12.6px;
    letter-spacing: 1px;
    text-align: right;
  }
  ${({ specialCard }) => specialCard && css`
    ${Logo} {
      position: absolute;
      top: 10px;
      right: -19px;
      left: auto;
      width: 203px;
      height: 220px;
    }
  `}
`;