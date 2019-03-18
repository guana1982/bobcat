import * as React from "react";
import styled from "styled-components";

export const SegmentButtonWrapper = styled.div`
  position: relative;
  display: -ms-inline-flexbox;
  display: inline-flex;
  vertical-align: middle;
  width: 384px;
  border-radius: 0 0 30px 30px;
  /* z-index: -1; */
  background: rgba(241, 241, 241, .6);
  height: 70px;
  button {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    width: 300px;
    height: 70px;
    border-radius: 0 0 27px 27px;
    flex: 1;
    color: ${props => props.theme.slateGrey};
    img {
      margin-right: 10px;
    }
    span {
      height: 30px;
      font-size: 16px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.88;
      letter-spacing: 1.3px;
      color: ${props => props.theme.slateGrey}
    }
    &:not(.selected) {
      z-index: 1;
    }
    &.selected {
      color: ${props => props.theme.slateGrey} !important;
      background: #fff;
      font-weight: 600;
      &:before {
        content: " ";
        position: absolute;
        width: 180%;
        height: 180%;
        top: -21%;
        left: -11%;
        z-index: -1;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url("img/rectangle.png");
      }
    }
    /* &:active {
      color: ${props => props.theme.primary};
      background: ${props => props.theme.light};
    } */
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
      <SegmentButtonWrapper>
        {props.options ?
          props.options.map((e, i) =>
          <button
            disabled={props.disabled}
            key={i}
            onClick={() => props.onChange(e.value)}
            className={props.value === e.value ? "selected" : ""}
            type="button"
          >
            <img src={`icons/${e.icon}.svg`} />
            <span>{e.label}</span>
          </button>
        ) : " --- " }
      </SegmentButtonWrapper>
    );
};
