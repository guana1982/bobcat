import * as React from "react";
import styled from "styled-components";

interface PhoneCardProps {
  className: any;
}

const PhoneCard_ = (props: PhoneCardProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <div id="illustration-wrap">
        <img src="icons/red.svg"/>
      </div>
      <div id="text-wrap">
        <h2>Download the App</h2>
        <h4>Create an account to <br/> track hydration, save <br/> your drinks, and more.</h4>
      </div>
    </div>
  );
};

export const PhoneCard = styled(PhoneCard_)`
  position: absolute;
  top: ${props => props.top ? props.top : '200px'};
  left: ${props => props.left ? props.left : '105px'};
  height: 350px;
  width: 220px;
  /* background: #bcbcbf; */
  #illustration-wrap {
    width: 159.6px;
    height: 159.6px;
    margin: auto;
    position: relative;
    #percentage {
      position: absolute;
      top: 57%;
      left: 52%;
      transform: translate(-50%, -50%);
      span:first-child {
        font-size: 60px;
        vertical-align: top;
      }
      span:last-child {
        position: relative;
        top: 9px;
        font-size: 20px;
      }
    }
    img {
      display: block;
      margin: auto;
    }
  }
  #text-wrap {
    text-align: center;
    margin-top: 35px;
    * { margin: 0; }
    h2 {
      font-family: NeuzeitGro-Bol;
      text-transform: uppercase;
      padding: 10px 0;
      font-size: 18px;
      line-height: 1.17;
      letter-spacing: 2.3px;
      color: #595959;
      margin-bottom: 10px;
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
      margin-top: 55px;
      span {
        font-size: 26px;
      }
    }
  }
`;
