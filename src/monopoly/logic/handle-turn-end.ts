import { BoardModel } from '../BoardModel';
import {
    PlayerInfo,
    GameStates, TurnState
  } from '../GameStates';

export default function handleTurnEnd(
    playersInfo: Array<PlayerInfo>,
    boardModel: BoardModel,
    gameStates: GameStates
  ) : GameStates {
  if ( gameStates.numDoublesRolled ) {
    // Roll again!
    return {...gameStates,
        turnState : TurnState.TURN_START,
        displayedPlayerId : null,
      };
  }
  const nextPlayerIndex = (gameStates.currentPlayerIndex+1) % playersInfo.length;

  const nextPlayerId = playersInfo[nextPlayerIndex].playerId;
  const nextPlayerState = gameStates.playerStates[nextPlayerId];
  const nextPlayerLocationId = nextPlayerState.locationId;
  const nextPlayerLocation = boardModel.getLocation( nextPlayerLocationId );

  return {
    ...gameStates,
    turnState : TurnState.TURN_START,
    currentPlayerIndex : nextPlayerIndex,
    displayedPlayerId : null,
  }
}
