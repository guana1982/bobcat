import * as React from "react";
import styled from "styled-components";
import { __ } from "@core/utils/lib/i18n";

interface PhoneCardProps {
  className: any;
  top: string;
  left: string;
  color: string;
}

const PhoneCard_ = (props: PhoneCardProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <div id="illustration-wrap">
        <PhoneIcon id="icon" color={props.color} />
      </div>
      <div id="text-wrap">
        <h2>{__("c_get_the_app")}</h2>
        {/* <h4>Track your hydration and save <br/> your customized drinks.</h4> */}
        <h4>{__("c_track_and_save")}</h4>
      </div>
    </div>
  );
};

export const PhoneCard = styled(PhoneCard_)`
  position: absolute;
  top: ${props => props.top ? props.top : 200}px;
  left: ${props => props.left ? props.left - 10 : 105}px;
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
    #icon {
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

const PhoneIcon = props => (
  <svg width={128} height={151} {...props}>
    <defs>
      <linearGradient id="prefix__a" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#EEE" />
        <stop offset="100%" stopColor={"#CBCFDA"} />
      </linearGradient>
      <radialGradient
        id="prefix__d"
        cy="12.688%"
        r="177.574%"
        fx="50%"
        fy="12.688%"
        gradientTransform="matrix(0 .42144 -1 0 .627 -.084)"
      >
        <stop offset="1.782%" stopColor="#FFF" stopOpacity={0.95} />
        <stop offset="100%" stopColor="#FFF" stopOpacity={0.9} />
      </radialGradient>
      <rect
        id="prefix__c"
        width={41.723}
        height={99}
        x={43}
        y={11}
        rx={2.614}
      />
      <filter
        id="prefix__b"
        width="356.5%"
        height="208.1%"
        x="-128.2%"
        y="-36.9%"
        filterUnits="objectBoundingBox"
      >
        <feMorphology in="SourceAlpha" radius={2} result="shadowSpreadOuter1" />
        <feOffset dy={4} in="shadowSpreadOuter1" result="shadowOffsetOuter1" />
        <feGaussianBlur
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
          stdDeviation={4.5}
        />
        <feComposite
          in="shadowBlurOuter1"
          in2="SourceAlpha"
          operator="out"
          result="shadowBlurOuter1"
        />
        <feColorMatrix
          in="shadowBlurOuter1"
          result="shadowMatrixOuter1"
          values="0 0 0 0 0.0676245133 0 0 0 0 0.0722260564 0 0 0 0 0.0808088861 0 0 0 0.1 0"
        />
        <feMorphology
          in="SourceAlpha"
          radius={3.5}
          result="shadowSpreadOuter2"
        />
        <feOffset dy={17} in="shadowSpreadOuter2" result="shadowOffsetOuter2" />
        <feGaussianBlur
          in="shadowOffsetOuter2"
          result="shadowBlurOuter2"
          stdDeviation={17.5}
        />
        <feComposite
          in="shadowBlurOuter2"
          in2="SourceAlpha"
          operator="out"
          result="shadowBlurOuter2"
        />
        <feColorMatrix
          in="shadowBlurOuter2"
          result="shadowMatrixOuter2"
          values="0 0 0 0 0.2 0 0 0 0 0.219607843 0 0 0 0 0.28627451 0 0 0 0.15 0"
        />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="shadowMatrixOuter2" />
        </feMerge>
      </filter>
      <linearGradient
        id="prefix__g"
        x1="20.38%"
        x2="43.366%"
        y1="-29.802%"
        y2="79.37%"
      >
        <stop offset="0%" stopColor={props.color} />
        <stop offset="100%" stopColor={props.color} />
      </linearGradient>
      <path
        id="prefix__f"
        d="M66.893 49.392L64 45.596l-2.894 3.796c-.973 1.27-.8 2.986.414 4.075l.014.012c1.36 1.233 3.574 1.233 4.947 0l.014-.012c1.2-1.089 1.373-2.805.4-4.075z"
      />
      <filter
        id="prefix__e"
        width="277.4%"
        height="247.5%"
        x="-88.7%"
        y="-53.8%"
        filterUnits="objectBoundingBox"
      >
        <feMorphology
          in="SourceAlpha"
          operator="dilate"
          radius={0.75}
          result="shadowSpreadOuter1"
        />
        <feOffset dy={2} in="shadowSpreadOuter1" result="shadowOffsetOuter1" />
        <feMorphology in="SourceAlpha" radius={1} result="shadowInner" />
        <feOffset dy={2} in="shadowInner" result="shadowInner" />
        <feComposite
          in="shadowOffsetOuter1"
          in2="shadowInner"
          operator="out"
          result="shadowOffsetOuter1"
        />
        <feGaussianBlur
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
          stdDeviation={1.5}
        />
        <feColorMatrix
          in="shadowBlurOuter1"
          values="0 0 0 0 0.988235294 0 0 0 0 0.866666667 0 0 0 0 0.807843137 0 0 0 1 0"
        />
      </filter>
      <linearGradient
        id="prefix__j"
        x1="38.43%"
        x2="47.409%"
        y1="-29.802%"
        y2="79.37%"
      >
        <stop offset="0%" stopColor={props.color} />
        <stop offset="100%" stopColor={props.color} />
      </linearGradient>
      <path
        id="prefix__i"
        d="M64 65c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15"
      />
      <filter
        id="prefix__h"
        width="183.3%"
        height="141.7%"
        x="-28.3%"
        y="-14.2%"
        filterUnits="objectBoundingBox"
      >
        <feMorphology
          in="SourceAlpha"
          operator="dilate"
          radius={0.75}
          result="shadowSpreadOuter1"
        />
        <feOffset
          dx={2}
          dy={2}
          in="shadowSpreadOuter1"
          result="shadowOffsetOuter1"
        />
        <feMorphology in="SourceAlpha" radius={1} result="shadowInner" />
        <feOffset dx={2} dy={2} in="shadowInner" result="shadowInner" />
        <feComposite
          in="shadowOffsetOuter1"
          in2="shadowInner"
          operator="out"
          result="shadowOffsetOuter1"
        />
        <feGaussianBlur
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
          stdDeviation={1.5}
        />
        <feColorMatrix
          in="shadowBlurOuter1"
          values="0 0 0 0 0.988235294 0 0 0 0 0.866666667 0 0 0 0 0.807843137 0 0 0 1 0"
        />
      </filter>
    </defs>
    <g fill="none" fillRule="evenodd">
      <ellipse
        cx={63.888}
        cy={86.033}
        fill="url(#prefix__a)"
        opacity={0.2}
        rx={63.888}
        ry={64.033}
      />
      <use fill="#000" filter="url(#prefix__b)" xlinkHref="#prefix__c" />
      <use fill="url(#prefix__d)" xlinkHref="#prefix__c" />
      <g fillRule="nonzero" stroke="#000" strokeWidth={0.5} opacity={0.252}>
        <path d="M84.97 119.19H43.091c-4.733 0-8.589-3.834-8.589-8.55V8.55c0-4.712 3.85-8.55 8.589-8.55h41.877c4.733 0 8.589 3.833 8.589 8.55v102.09c-.006 4.716-3.856 8.55-8.589 8.55z" />
        <path d="M44.63 115.225c-3.335 0-6.051-2.703-6.051-6.024V9.534c0-3.321 2.716-6.025 6.051-6.025h5.579l.2.304c.341.517.336 1.197.336 1.647.01.36.61 1.48 1.597 1.6.257.032 1.113.068 3.713.068 3.347 0 7.728-.063 8.379-.073.678.01 5.053.073 8.4.073 2.6 0 3.456-.036 3.713-.068.988-.12 1.587-1.24 1.592-1.527 0-.518-.005-1.197.33-1.72l.2-.309h4.691c3.336 0 6.052 2.704 6.052 6.024v99.668c0 3.33-2.716 6.03-6.052 6.03H44.63z" />
      </g>
      <g fillRule="nonzero">
        <use fill="#000" filter="url(#prefix__e)" xlinkHref="#prefix__f" />
        <use
          stroke="url(#prefix__g)"
          strokeWidth={1.5}
          xlinkHref="#prefix__f"
        />
      </g>
      <circle
        cx={64}
        cy={50}
        r={15}
        stroke="#000"
        strokeWidth={0.75}
        opacity={0.172}
      />
      <g fillRule="nonzero">
        <use fill="#000" filter="url(#prefix__h)" xlinkHref="#prefix__i" />
        <use
          stroke="url(#prefix__j)"
          strokeWidth={1.5}
          xlinkHref="#prefix__i"
        />
      </g>
    </g>
  </svg>
);