import * as React from "react";
import styled from "styled-components";

export const SegmentButtonWrapper = styled.div`
  position: relative;
  display: -ms-inline-flexbox;
  display: inline-flex;
  vertical-align: middle;
  /* background: rgba(231, 231, 231, .7); */
  /* border-radius: 0 0 37px 37px; */
  width: 384px;
  border-radius: 0 0 30px 30px;
  /* background-image: url("img/segment.svg"); */
  z-index: -1;
  background: #f9f9f9;
  height: 70px;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    width: 300px;
    height: 70px;
    border-radius: 0 0 30px 30px;
    position: relative;
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
    &.selected {
      color: ${props => props.theme.slateGrey} !important;
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
`;

interface IOption {
  label: string;
  value: any;
  icon: string;
}

interface SegmentButtonProps {
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
