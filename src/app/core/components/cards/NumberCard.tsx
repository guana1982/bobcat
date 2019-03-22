import * as React from "react";
import styled from "styled-components";

interface NumberCardProps {
  className: any;
}

const NumberCard_ = (props: NumberCardProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <div id="illustration-wrap">
        <div id="circle"></div>
        <img src="icons/plastic-bottle.svg"/>
        <h2>120</h2>
      </div>
      <div id="text-wrap">
        <h2>PLASTIC FREE!</h2>
        <h4>You’re making an <br/> impact. This machine <br/> has saved 120 bottles.</h4>
      </div>
    </div>
  );
};

export const NumberCard = styled(NumberCard_)`
  position: absolute;
  top: ${props => props.top ? props.top : 221}px;
  right: ${props => props.right ? props.right : 174.6}px;
  height: 350px;
  width: 200px;
  /* background: #bcbcbf; */
  #illustration-wrap {
    #circle {
      margin: auto;
      width: 128.8px;
      height: 128.8px;
      opacity: 0.2;
      border-radius: 50%;
      background-image: linear-gradient(to bottom, #fff, #cbcfda);
    }
    text-align: center;
    position: relative;
    img {
      position: absolute;
      top: -6px;
      left: 50%;
      transform: translate(-50%, 0);
    }
    h2 {
      font-family: NeuzeitGro-Reg;
      text-transform: uppercase;
      height: 45px;
      margin: 0;
      position: absolute;
      left: 50%;
      top: 41%;
      transform: translate(-50%, -50%);
      font-size: 60px;
      color: ${props => props.color};
      opacity: 1;
    }
  }
  #text-wrap {
    text-align: center;
    margin-top: 45px;
    * { margin: 0; }
    h2 {
      font-family: NeuzeitGro-Bol;
      font-size: 18px;
      line-height: 1.17;
      letter-spacing: 2.3px;
      color: #595959;
      margin-bottom: 10px;
      padding: 10px;
    }
    h4 {
      font-family: NeuzeitGro-Reg;
      font-size: 16px;
      line-height: 1.13;
      letter-spacing: 0.5px;
      color: #474748;
    }
  }
`;