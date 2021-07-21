import React, {
  } from 'react';
import {BoardModel} from './BoardModel';
import {PlayerInfo} from './GameStates';

import './Player.css';
import propertyImage from './property-0.svg';
import player from './player-0.svg';

interface Props {
  boardModel : BoardModel;
  locationId : string;
  ownerInfo : PlayerInfo;
}

function Property( props : Props ) {
  const classes = [
      'property',
      'colour-filter-'+props.ownerInfo.colour,
    ].filter(Boolean).join( ' ' );

  const [x,y] = props.boardModel.getLocation( props.locationId ).coords;

  const [offsetX,offsetY] = [30,5];

  const positionStyle = {
    left : x + offsetX,
    top  : y + offsetY,
  } as React.CSSProperties;

  return (
    <img src={propertyImage} className={classes}
        style={positionStyle}
        height={15}
        />
  );
}

export default Property;
