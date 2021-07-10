import React, {useState} from 'react';

import BoardModel from './BoardModel';
import {PlayerStateMap} from './GameStates';

import './Player.css';
import player from './player-0.svg';


interface Props {
  playerStates : PlayerStateMap;
  playerId : string;

  playerIndexAtLocation : number;

  gotoLocationId? : string;

  boardModel : BoardModel;

  onStepEnd? : ()=>void;
}

const playerColours : Array<string> = [
    'green',
    'purple',
    'light-blue',
  ];


const getColourClass = ( playerIndex : number ) : string =>
  playerColours[ playerIndex % playerColours.length ]

function Player( props : Props ) {
  const [isAnimating,setIsAnimating] = useState( false );

  const playerState = props.playerStates[props.playerId];

  const [offsetX,offsetY] = [props.playerIndexAtLocation * 5, props.playerIndexAtLocation * 10];

  const [x,y] = props.boardModel.getCoordinates( playerState.locationId );

  const [gotoX,gotoY] = playerState.gotoLocationId ?
      props.boardModel.getCoordinates( playerState.gotoLocationId ) : [x,y];

  const [diffX,diffY] = [gotoX-x, gotoY-y];

  if ( playerState.gotoLocationId ) {
    if ( ! isAnimating ) {
      setIsAnimating( true );
    }
  }

  const handleAnimationEnd = () => {
    setIsAnimating( false );
    props.onStepEnd?.()
  }

  const classes = [
      'player',
      'colour-filter-'+getColourClass(props.playerIndexAtLocation),
      isAnimating && 'animating'
    ].filter(Boolean).join( ' ' );

  const style = {
    left : x + offsetX,
    top  : y + offsetY,
    "--translateX" : diffX+'px',
    "--translateY" : diffY+'px',
  } as React.CSSProperties;

  return (
    <img src={player} className={classes}
        style={style}
        onAnimationEnd={handleAnimationEnd}
        alt={'Player '+props.playerId} />
  );
}

Player.defaultProps = {
  playerIndexAtLocation : 0
} as Partial<Props>;

export default Player;
