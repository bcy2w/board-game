import { GameStates } from '../GameStates';

interface Params {
  playerId : string,
}

/**
 * Change the Player Info Display to show the specified player.
 * @param playerId ID fo player to display
 * @param gameStates 
 * @returns 
 */
export function handleSetUserInfoDisplay( {
    playerId
 }: Params,
 gameStates: GameStates ) : GameStates {
  return {...gameStates,
    displayedPlayerId : playerId
  };
}
