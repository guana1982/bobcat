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

      </div>
      <div id="text-wrap">
        <h2>PLASTIC FREE!</h2>
        <h4>You’re making an impact. This machine has saved 120 bottles.</h4>
      </div>
    </div>
  );
};

export const NumberCard = styled(NumberCard_)`
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
  }
`;