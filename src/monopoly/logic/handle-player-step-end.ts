import { endoPipe } from './fp';
import { BoardModel } from '../BoardModel';
import {
    PlayerInfo,
    playerStatesAction, updatePlayerCashAction,
    GameStates
  } from '../GameStates';
import handlePlayerLocationLanding from './handle-location-landing';

interface Params {
  playersInfo : Array<PlayerInfo>;
  boardModel : BoardModel;
  playerId : string,
}

/**
 * Player has finished stepping to a new location.
 * @param index Player's index
 */
export default function handlePlayerStepEnd ( {
      playersInfo,
      boardModel,
      playerId,
    }: Params,
    gameStates: GameStates
  ) : GameStates {
  const playerState = gameStates.playerStates[ playerId ];
  const currentLocationId = playerState.gotoLocationId || playerState.locationId;

console.log( 'ZZZ ps 1', playerState );

  const playerStatesActions = [];

  playerStatesActions.push( playerStatesAction( playerId, {
      locationId : currentLocationId,
      gotoLocationId : undefined,
    }) );

  // Are we at Go?
  if ( currentLocationId === 'a-0' ) {
    playerStatesActions.push( updatePlayerCashAction( playerState, 100 ) )
  }
  const newGameStates = { ...gameStates,
    playerStates : endoPipe( ...playerStatesActions )( gameStates.playerStates )
  };

console.log( 'ZZZ ps 2', newGameStates.playerStates[playerId] );

  if ( playerState.stepsAvailable < 1 ) {
    // We are done stepping.
    return handlePlayerLocationLanding(
      { playersInfo, boardModel, playerId }, newGameStates );
  }
  return newGameStates;
}
