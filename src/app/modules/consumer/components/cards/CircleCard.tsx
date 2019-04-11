import * as React from "react";
import styled from "styled-components";
import Circle from "react-circle";
import { ConsumerContext } from "@core/containers";

interface CircleCardProps {
  className: any;
  top: string;
  left: string;
  color: string;
}

const CircleCard_ = (props: CircleCardProps) => {
  const { className } = props;

  const calcolaPerc = (tot, num): number => Number(((num / tot) * 100).toFixed(0));

  const consumerConsumer = React.useContext(ConsumerContext);
  const { currHydraLvl, hydraGoal } = consumerConsumer.dataConsumer;
  let perc = calcolaPerc(hydraGoal, currHydraLvl);
  perc = perc > 100 ? 100 : perc;

  const diffHydra = hydraGoal - currHydraLvl;
  let messageHydra = "";
  if (perc > 0 && perc <= 25) {
    messageHydra = "GREAT START!";
  } else if (perc > 25 && perc <= 60) {
    messageHydra = "KEEP GOING!";
  } else if (perc > 60 && perc <= 99) {
    messageHydra = "ALMOST THERE!";
  } else if (perc === 100) {
    messageHydra = "CONGRATULATION!";
  }

  return (
    <div className={className}>
      <div id="illustration-wrap">
        <Circle
          size={"159.6px"}
          progress={perc}
          progressColor={props.color}
          // textColor={}
          lineWidth={"10px"}
          showPercentage={false}
        />
        <span id="percentage">
          <span>{perc}</span>
          <span>%</span>
        </span>
      </div>
      <div id="text-wrap">
        <h2>{messageHydra}</h2>
        {diffHydra !== 0 ?
          <h4>{diffHydra} more oz to reach <br/> your daily goal.</h4> :
          <h4>You've reached your daily <br/> hydration goal of {hydraGoal} oz</h4>
        }
        {/* <h3><span>{currHydraLvl}</span> / {hydraGoal} OZ</h3> */}
      </div>
    </div>
  );
};

export const CircleCard = styled(CircleCard_)`
  position: absolute;
  top: ${props => props.top ? props.top : 200}px;
  left: ${props => props.left ? props.left : 115}px;
  height: 350px;
  width: 200px;
  /* background: #bcbcbf; */
  #illustration-wrap {
    width: 159.6px;
    height: 159.6px;
    margin: auto;
    position: relative;
    #percentage {
      color: ${props => props.color};
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
    /* img {
      display: block;
      margin: auto;
    } */
  }
  #text-wrap {
    text-align: center;
    margin-top: 35px;
    * { margin: 0; }
    h2 {
      font-family: NeuzeitGro-Bol;
      text-transform: uppercase;
      padding: 10px;
      font-size: 18px;
      line-height: 1.17;
      letter-spacing: 2.3px;
      color: #595959;
      margin-bottom: 5px;
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