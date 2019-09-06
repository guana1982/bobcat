import * as React from "react";
import { CircleCard } from "../cards/CircleCard";
import { PhoneCard } from "../cards/PhoneCard";
import { NumberCard } from "../cards/NumberCard";
import { coordsCards, coordsCardsWithSlider, coordsSliderOpen, coordsSliderClose } from "@core/utils/constants";
import styled from "styled-components";
import { Button } from "../common/Button";

interface CardsWrapProps {
  className?: any;
  presentSlide: boolean;
  indexBeverageForLongPressPour_: number;
  indexFavoritePouring_: number;
  slideOpen: boolean;
  lengthBeverages?: number;
  fullMode: boolean;
  color: string;
  endPourEvent: () => void;
}

const CardsWrap_ = (props: CardsWrapProps) => {

  const { className, presentSlide, indexBeverageForLongPressPour_, indexFavoritePouring_, color, slideOpen, endPourEvent, lengthBeverages, fullMode } = props;

  let coordsInfoCard = ((presentSlide && !fullMode) ? coordsCardsWithSlider : coordsCards)[lengthBeverages - 1];

  const validBeverage = indexBeverageForLongPressPour_ !== null && indexBeverageForLongPressPour_ >= 0;
  const validFavorite = indexFavoritePouring_ !== null && indexFavoritePouring_ >= 0;

  if (!(validBeverage || validFavorite))
    return null;

  let coords = null;
  if (validBeverage)
    coords = coordsInfoCard[indexBeverageForLongPressPour_];
  else if (validFavorite) {
    if (slideOpen)
      coords = coordsSliderOpen[indexFavoritePouring_];
    else
      coords = coordsSliderClose[indexFavoritePouring_];
  }

  if (!coords)
    return <></>;

  return (
    <div className={className}>
      {presentSlide ?
        <CircleCard
          top={coords.card1.top}
          left={coords.card1.left}
          color={color}
        /> :
        <PhoneCard
          top={coords.card1.top}
          left={coords.card1.left}
          color={color}
        />
      }
      <NumberCard
        top={coords.card2.top}
        right={coords.card2.right}
        color={color}
      />
      <Button detectValue="exit-btn" onClick={() => endPourEvent()} text="Done" icon="log-out" />
    </div>
  );
};

export const CardsWrap = styled(CardsWrap_)`
  * {
    z-index: 99;
  }
  #exit-btn {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
`;