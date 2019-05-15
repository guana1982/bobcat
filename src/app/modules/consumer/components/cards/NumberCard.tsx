import * as React from "react";
import styled from "styled-components";
import { ConfigContext, ConsumerContext } from "@core/containers";
import { __ } from "@core/utils/lib/i18n";

interface NumberCardProps {
  className: any;
  top: string;
  left: string;
  color: string;
}

const NumberCard_ = (props: NumberCardProps) => {
  const { className, color } = props;

  const configConsumer = React.useContext(ConfigContext);
  const consumerConsumer = React.useContext(ConsumerContext);

  const { isLogged } = consumerConsumer;
  const savedBottleMachine = configConsumer.sustainabilityData.saved_bottle_year;
  let savedBottleConsumer = null;
  if (consumerConsumer.dataConsumer && consumerConsumer.dataConsumer.saveBottles) {
    savedBottleConsumer = consumerConsumer.dataConsumer.saveBottles;
  }

  const savedBottle = !isLogged ? savedBottleMachine : savedBottleConsumer;

  return (
    <div className={className}>
      <div id="illustration-wrap">
        <div id="circle"></div>
        <BottleIcon id="icon" color={color} />
        <span>{savedBottle}</span>
      </div>
      <div id="text-wrap">
        {!isLogged ?
          <h2>{__("c_make_inpact")}</h2> :
          <h4>{__("c_making_inpact")}</h4>
        }
        {!isLogged ?
          <h4>{savedBottle} {__("c_saved_bottles")}</h4> :
          <h4>{__("c_you_helped_eliminate")} {savedBottle} <br/> {__("c_eliminated_bottle_size")}</h4>
        }
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
    #icon {
      position: absolute;
      top: -6px;
      left: 50%;
      transform: translate(-50%, 0);
    }
    span {
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

const BottleIcon = props => (
  <svg width={14} height={35} {...props}>
    <defs>
      <linearGradient id="prefix__cc" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" stopColor={props.color} />
        <stop offset="100%" stopColor={props.color} />
      </linearGradient>
      <path
        id="prefix__bb"
        d="M9.049 0H4.535c-.967 0-1.693.76-1.693 1.773v1.519c0 .59.322 1.182.806 1.435L.907 8.777C-.06 10.297.02 11.562.02 13.249a3 3 0 0 0 1.129 2.363c-1.532 1.182-1.532 3.544 0 4.726-1.532 1.182-1.532 3.544 0 4.725C.504 25.57.02 26.414.02 27.343v3.374c0 2.28 1.774 4.135 3.95 4.135h5.64c2.096 0 3.869-1.857 3.869-4.135v-3.375c0-.928-.403-1.772-1.129-2.279 1.532-1.181 1.532-3.543 0-4.725 1.532-1.182 1.532-3.544 0-4.726.726-.506 1.129-1.435 1.129-2.363 0-1.688.161-2.953-.887-4.472l-2.66-4.05c.483-.253.725-.844.725-1.435v-1.52C10.658.76 9.932 0 9.046 0h.003zm3.55 27.218v3.569c0 1.696-1.214 3.123-2.752 3.123H4.182c-1.538 0-2.832-1.428-2.832-3.123v-3.57c0-.981.729-1.785 1.7-1.785h7.85c.971 0 1.7.804 1.7 1.786h-.001zM10.9 24.49H3.05c-2.267 0-2.267-3.767 0-3.767h7.85c2.267 0 2.267 3.767 0 3.767zm0-4.71H3.05c-2.267 0-2.267-3.767 0-3.767h7.85c2.267 0 2.267 3.768 0 3.768zm1.04-10.504c.808 1.317.647 2.459.647 3.95 0 1.055-.727 1.845-1.696 1.845H3.058c-.97 0-1.697-.79-1.697-1.844 0-1.493-.161-2.635.727-3.951L4.995 4.71H8.95l2.987 4.566h.003zM9.226 1.56v1.59c0 .353-.321.618-.563.618h-4.5c-.32 0-.562-.265-.562-.618V1.56c0-.353.241-.618.563-.618h4.5c.24 0 .562.265.562.618z"
      />
      {/* <filter
        id="prefix__a"
        width="181.5%"
        height="131.6%"
        x="-40.7%"
        filterUnits="objectBoundingBox"
      >
        <feOffset dy={2} in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
          stdDeviation={1.5}
        />
        <feColorMatrix
          in="shadowBlurOuter1"
          values="0 0 0 0 0.168627451 0 0 0 0 0.611764706 0 0 0 0 0.854901961 0 0 0 1 0"
        />
      </filter> */}
    </defs>
    <g fill="none">
      {/* <use fill="#000" xlinkHref="#prefix__bb" /> */}
      <use fill="url(#prefix__cc)" xlinkHref="#prefix__bb" />
    </g>
  </svg>
);