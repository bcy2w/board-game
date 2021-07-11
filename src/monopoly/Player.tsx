import React, {useState} from 'react';

import BoardModel from './BoardModel';
import {PlayerState} from './GameStates';

import './Player.css';
import player from './player-0.svg';


interface Props {
  playerState : PlayerState;

  playerIndexAtLocation : number;

  gotoLocationId? : string;

  boardModel : BoardModel;

  onClick? : ()=>void;
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

  const [offsetX,offsetY] = [props.playerIndexAtLocation * 5, props.playerIndexAtLocation * 10];

  const [x,y] = props.boardModel.getCoordinates( props.playerState.locationId );

  const [gotoX,gotoY] = props.playerState.gotoLocationId ?
      props.boardModel.getCoordinates( props.playerState.gotoLocationId ) : [x,y];

  const [diffX,diffY] = [gotoX-x, gotoY-y];

  if ( isAnimating && !props.playerState.gotoLocationId ) {
    setIsAnimating( false );
  }
  if ( !isAnimating && props.playerState.gotoLocationId ) {
    setIsAnimating( true );
  }

  const handleAnimationEnd = () => {
    props.onStepEnd?.();
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
        onClick={props.onClick}
        onAnimationEnd={handleAnimationEnd}
        alt={'Player '+props.playerState.playerInfo.playerId} />
  );
}

Player.defaultProps = {
  playerIndexAtLocation : 0
} as Partial<Props>;

export default Player;
