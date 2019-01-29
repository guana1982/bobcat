import * as React from "react";
import styled from "styled-components";

export const SreenWrapper = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0000FF;
  display: block;
  z-index: 1000;
`;

const _sizeWarning = 200;
export const Warning = styled.div`
  position: absolute;
  width: ${_sizeWarning}px;
  height: ${_sizeWarning}px;
  bottom: ${-_sizeWarning / 2}px;
  right: ${-_sizeWarning / 2}px;
  border-radius: 50%;
  background: #fff;
  &:before {
      content: url("icons/crew.svg");
      position: absolute;
      top: ${_sizeWarning / 5}px;
      left: ${_sizeWarning / 5}px;
      width: ${_sizeWarning / 5}px;
      height: ${_sizeWarning / 5}px;
    }
`;