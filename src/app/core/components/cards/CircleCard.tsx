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
  height: 500px;
  width: 200px;
  #illustration-wrap {

  }
  #text-wrap {
    font-family: NeuzeitGro-Bol;
    text-align: center;
    * { margin: 0; }
    h2 {
      font-size: 18px;
      line-height: 1.17;
      letter-spacing: 2.3px;
      color: #595959;
    }
    h4 {
      font-size: 16px;
      line-height: 1.13;
      letter-spacing: 0.5px;
      color: #474748;
    }
    h3 {
      font-size: 15.9px;
      line-height: 1.06;
    }
  }
`;