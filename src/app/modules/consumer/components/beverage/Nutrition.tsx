import * as React from "react";
import { __ } from "@utils/lib/i18n";
import styled from "styled-components";

interface NutritionProps {
  className: any;
  title: string;
  color: string;
  show: boolean;
}

export const Nutrition_ = (props: NutritionProps) => {
  const { title, show, className } = props;

  if (!show)
    return null;

  return (
    <div className={className}>
      <h2 id="title">{__(title)}</h2>
      <div className="row">
        <span>Nutrition Facts</span>
        <span>Serving Size 0.3 fl oz (9 mL)</span>
      </div>
      <div className="row">
        <span>Amount Per Serving</span>
        <span>Calories {"0"}</span>
      </div>
      <div id="content-values">
        <div className="value">
          <span></span>
          <span></span>
          <span>% Daily Value *</span>
        </div>
        <div className="value">
          <span>Total Fat</span>
          <span>0g</span>
          <span>0%</span>
        </div>
        <div className="value">
          <span>Sodium</span>
          <span>0mg</span>
          <span>0%</span>
        </div>
        <div className="value">
          <span>Potassium</span>
          <span>35mg</span>
          <span>1%</span>
        </div>
        <div className="value">
          <span>Total Carbohydrate</span>
          <span>0g</span>
          <span>0%</span>
        </div>
        <div className="value">
          <span>Protein</span>
          <span>0g</span>
          <span>0g</span>
        </div>
      </div>
    </div>
  );
};

export const Nutrition = styled(Nutrition_)`
  position: absolute;
  bottom: 0;
  width: calc(100% - 20px);
  margin: 10px;
  font-size: 10px;
  #title {
    color: ${props => props.color};
    text-transform: uppercase;
    text-align: left;
    font-family: NeuzeitGro-Bol;
    line-height: 1.57;
    letter-spacing: 2.5px;
    margin: 0;
    padding: 0 5px;
    height: 40px;
    display: flex;
    align-items: center;
  }
  .row {
    display: block;
    padding: 5px;
    border-bottom: solid 2.3px #dfdfdf;
    span {
      display: block;
      text-align: left;
      &:first-child {
        font-family: NeuzeitGro-Bol;
      }
    }
  }
  #content-values {
    .value {
      padding: 5px;
      border-bottom: solid 0.5px #dfdfdf;
      &:last-child {
        border-bottom: none;
      }
      span {
        &:nth-child(1) {
          float: left;
        }
        &:nth-child(2) {
          margin-left: 1px
        }
        &:nth-child(3) {
          float: right
        }
      }
    }
  }
`;