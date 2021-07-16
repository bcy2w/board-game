import React, {
    useState,
    AnimationEvent
  } from 'react';

import BoardModel from './BoardModel';
import {PlayerState} from './GameStates';

import './Player.css';
import player from './player-0.svg';


interface Props {
  playerState : PlayerState;

  isCurrentPlayer : boolean;

  playerIndexAtLocation : number;

  gotoLocationId? : string;

  boardModel : BoardModel;

  onClick? : ()=>void;
  onStepEnd? : ()=>void;
}

const playerColours : Array<string> = [
    'green',
    'orange',
    'blue',
  ];


const getColourClass = ( playerIndex : number ) : string =>
  playerColours[ playerIndex % playerColours.length ]

function Player( props : Props ) {
  const [isAnimating,setIsAnimating] = useState( false );

  const [offsetX,offsetY] = [props.playerIndexAtLocation * 8, props.playerIndexAtLocation * 10];

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

  const handleAnimationEnd = (event:AnimationEvent) => {
    console.log( 'ZZZ event', event );
    if ( event.animationName === 'animateMove' ) {
      props.onStepEnd?.();
    }
  }

  // console.log( 'ZZZ is Player', props)

  const classes = [
      'player',
      isAnimating && 'animating',
//      props.isCurrentPlayer && 'current-player',
    ].filter(Boolean).join( ' ' );

  const imgClasses = [
      'colour-filter-'+getColourClass(props.playerIndexAtLocation),
      props.isCurrentPlayer && 'current-player',
    ].filter(Boolean).join( ' ' );

  const positionStyle = {
    left : x + offsetX,
    top  : y + offsetY,
    "--translateX" : diffX+'px',
    "--translateY" : diffY+'px',
  } as React.CSSProperties;

  return (
    <div className={classes}
        style={positionStyle}
        onAnimationEnd={handleAnimationEnd} >
      <img src={player} className={imgClasses}
          height={30}
          onClick={props.onClick}
          alt={'Player '+props.playerState.playerInfo.playerId} />
    </div>
  );
}

Player.defaultProps = {
  playerIndexAtLocation : 0
} as Partial<Props>;

export default Player;
