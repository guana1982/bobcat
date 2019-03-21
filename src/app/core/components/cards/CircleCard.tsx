import * as React from "react";
import styled from "styled-components";

interface CircleCardProps {
  className: any;
}

const CircleCard_ = (props: CircleCardProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <div id="illustration-wrap">
        <img src="icons/red.svg"/>
      </div>
      <div id="text-wrap">
        <h2>Keep going!</h2>
        <h4>56 more oz to reach your daily goal.</h4>
        <h3>72 / 128 OZ</h3>
      </div>
    </div>
  );
};

export const CircleCard = styled(CircleCard_)`
  position: absolute;
  top: 100px;
  left: 200px;
  height: 350px;
  width: 200px;
  /* background: #bcbcbf; */
  #illustration-wrap {
    img {
      display: block;
      margin: auto;
    }
  }
  #text-wrap {
    text-align: center;
    margin-top: 43px;
    * { margin: 0; }
    h2 {
      font-family: NeuzeitGro-Bol;
      padding: 10px;
      font-size: 18px;
      line-height: 1.17;
      letter-spacing: 2.3px;
      color: #595959;
      margin-bottom: 5px;
    }
    h4 {
      font-family: NeuzeitGro-Reg;
      font-size: 16px;
      line-height: 1.13;
      letter-spacing: 0.5px;
      color: #474748;
    }
    h3 {
      font-family: NeuzeitGro-Bol;
      font-size: 15.9px;
      line-height: 1.06;
    }
  }
`;
