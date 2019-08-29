import * as React from "react";
import styled from "styled-components";
import { __ } from "@core/utils/lib/i18n";

const SparklingIcon = () => (
  <svg id="sparkling-icon" width={15} height={24}>
    <path
      fill="#545457"
      d="M7.232 0C5.135 0 3.314 1.171 2.436 2.886a.512.512 0 0 0-.06.418c.04.14.14.258.275.325a.55.55 0 0 0 .433.02.528.528 0 0 0 .306-.298c.702-1.371 2.157-2.308 3.842-2.308 2.373 0 4.286 1.863 4.286 4.174 0 2.311-1.913 4.174-4.286 4.174-2.373 0-4.285-1.863-4.285-4.174a.516.516 0 0 0-.154-.374.548.548 0 0 0-.764 0 .52.52 0 0 0-.154.374c0 2.876 2.405 5.218 5.357 5.218 2.953 0 5.357-2.342 5.357-5.218C12.59 2.342 10.185 0 7.232 0zM2.411 10.696C1.086 10.696 0 11.753 0 13.044c0 1.29 1.086 2.347 2.41 2.347 1.325 0 2.411-1.057 2.411-2.347s-1.086-2.348-2.41-2.348zm0 1.043c.746 0 1.339.578 1.339 1.305 0 .726-.593 1.304-1.34 1.304-.745 0-1.339-.578-1.339-1.304 0-.727.594-1.305 1.34-1.305zm8.571 1.565c-2.213 0-4.018 1.758-4.018 3.913 0 2.156 1.805 3.913 4.018 3.913S15 19.373 15 17.217c0-2.155-1.805-3.913-4.018-3.913zm0 1.044c1.633 0 2.947 1.279 2.947 2.87 0 1.59-1.314 2.869-2.947 2.869s-2.946-1.279-2.946-2.87c0-1.59 1.313-2.87 2.946-2.87zM3.75 19.304c-1.325 0-2.41 1.058-2.41 2.348C1.34 22.942 2.424 24 3.75 24c1.325 0 2.41-1.058 2.41-2.348 0-1.29-1.085-2.348-2.41-2.348zm0 1.044c.746 0 1.34.578 1.34 1.304 0 .727-.594 1.305-1.34 1.305-.746 0-1.34-.578-1.34-1.305 0-.726.594-1.304 1.34-1.304z"
    />
  </svg>
);

const StillIcon = () => (
  <svg  id="still-icon" width="20" height="15" viewBox="0 0 20 15">
      <g fill="none" fillRule="nonzero" stroke="#565657" strokeWidth="1.4">
          <path d="M0 2.8C1.43.933 3.42 0 5.97 0c3.218 0 3.86 2.8 8.334 2.8 2.384 0 4.053-.7 5.006-2.1M0 8.4c1.43-1.867 3.42-2.8 5.97-2.8 3.218 0 3.86 2.8 8.334 2.8 2.384 0 4.053-.7 5.006-2.1M0 14c1.43-1.867 3.42-2.8 5.97-2.8 3.218 0 3.86 2.8 8.334 2.8 2.384 0 4.053-.7 5.006-2.1"/>
      </g>
  </svg>
);

export const SegmentButtonWrapper = styled.div`
  position: relative;
  display: -ms-inline-flexbox;
  display: inline-flex;
  vertical-align: middle;
  height: 55px;
  /* margin-top: 8px; */
  background: #f5f5f5;
  border-radius: 40px;
  border: 10px solid #fff;
  box-sizing: content-box;
  button {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    width: 180px;
    height: 55px;
    flex: 1;
    border-radius: 30px;
    /* &:nth-child(1) {
      margin-right: 3px;
      &, &:before {
        border-radius: 30px 0 0 30px;
      }
    }
    &:nth-child(2) {
      margin-left: 3px;
      &, &:before {
        border-radius: 0 30px 30px 0;
      }
    } */
    span {
      height: 30px;
      font-family: NeuzeitGro-Bol;
      font-size: 16px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 2.2;
      letter-spacing: 1.2px;
      margin-left: 10px;
    }
    &.selected {
      z-index: -1;
      background: #fff;
      box-shadow: 5px 20px 24px 0 rgba(157, 164, 167, 0.17), 0 -2px 8px 0 rgba(157, 164, 167, 0.1);
      span {
        color: #2b9cda;
      }
      #still-icon g {
        stroke: #2b9cda;
      }
      #sparkling-icon path {
        fill: #2b9cda;
      }
    }
    &:not(.selected) {
      background: none;
      font-weight: 600;
      span {
        color: #565657;
      }
      #still-icon g {
        stroke: #565657;
      }
      #sparkling-icon path {
        fill: #565657;
      }
      &:before {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        /* border-radius: 0 0 27px 27px; */
      }
    }
  }

  position: absolute; /* => _SegmentButton */
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
`;

interface IOption {
  label: string;
  value: any;
  icon: string;
}

export interface SegmentButtonProps {
  options: IOption[];
  value?: any;
  label?: string;
  onChange: (value) => void;
  children?: any;
  disabled?: any;
}

interface SegmentButtonState {

}

export const SegmentButton = (props: SegmentButtonProps) => {

    return (
      <SegmentButtonWrapper id="segment-button">
        {props.options ?
          props.options.map((e, i) =>
          <button
            disabled={props.disabled}
            key={i}
            onClick={() => props.onChange(e.value)}
            className={props.value === e.value ? "selected" : ""}
            type="button"
          >
            {e.icon === "sparkling" && <SparklingIcon />}
            {e.icon === "still" && <StillIcon />}
            <span>{__(e.label)}</span>
          </button>
        ) : " --- " }
      </SegmentButtonWrapper>
    );
};
