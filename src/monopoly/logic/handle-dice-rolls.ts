import { EndoFn, endoPipe } from './fp';
import { BoardModel, SpecialLocationType, getNextLocations } from '../BoardModel';
import {
    PlayerInfo, PlayerStateMap, playerStatesAction,
    GameStates, TurnState
  } from '../GameStates';
import handleTurnEnd from './handle-turn-end';

function hasDuplicates( a: Array<any> ): boolean {
  return new Set(a).size != a.length;
}

interface Params {
  playersInfo : Array<PlayerInfo>;
  boardModel : BoardModel;
  currentPlayerId : string;
  rollValues : Array<number>;
}

export default function handleDiceRoll( {
      playersInfo,
      boardModel,
      currentPlayerId,
      rollValues,
    } : Params,
    gameStates : GameStates ) : GameStates {

  if ( gameStates.turnState !== TurnState.TURN_START ) {
    // Not time to roll.  Ignore.
    return gameStates;
  }

  const rolledDoubles = hasDuplicates( rollValues );
  const total = rollValues.reduce( (subtotal,value)=>subtotal+value, 0 );

  const currentPlayerState = gameStates.playerStates[ currentPlayerId ]
  const currentLocationId = currentPlayerState.locationId;
  const isInJail = boardModel.getLocation( currentLocationId ).type === SpecialLocationType.JAIL;

  const playerStatesActions : Array<EndoFn<PlayerStateMap>> = [];

  // In-Jail Logic
  if ( isInJail ) {
    const currentTurnsInJail = currentPlayerState.numTurnsInJail ?? 0;

    if ( rolledDoubles ) {

    } else if ( currentTurnsInJail > 2 ) {
      // TODO: pay fine
      playerStatesActions.push(
          playerStatesAction(
              currentPlayerId, { cash : currentPlayerState.cash - 50 } )
        );

    } else {
      // Spend turn in Jail

      const playerStatesChange = playerStatesAction(
          currentPlayerId, { numTurnsInJail : currentTurnsInJail + 1 }
        );

      return handleTurnEnd( playersInfo, boardModel,
        { ...gameStates,
          playerStates : playerStatesChange( gameStates.playerStates )
        } );
    }
  }

  const notInJailRolledDoubles = !isInJail && rolledDoubles;
  const numDoublesRolled = gameStates.numDoublesRolled;

  if ( notInJailRolledDoubles && numDoublesRolled > 1 ) {
    // This would be at least our third doubles! Go to Jail!
    const playerStatesChange = playerStatesAction( currentPlayerId, {
        locationId : 'jail',
        stepsAvailable : 0,
      } );
    return handleTurnEnd( playersInfo, boardModel,
      { ...gameStates,
        playerStates : playerStatesChange( gameStates.playerStates ),
        numDoublesRolled : 0
      } );
  }

  const nextLocations = getNextLocations( boardModel, currentLocationId );
  const nextLocationId = nextLocations[0].locationId;

  playerStatesActions.push(
      playerStatesAction( currentPlayerId, {
          stepsAvailable: total - 1,
          gotoLocationId: nextLocationId,
          numTurnsInJail: 0,
        } )
    );

  return { ...gameStates,
    turnState : TurnState.STEPPING,
    playerStates : endoPipe( ...playerStatesActions )( gameStates.playerStates ),
    numDoublesRolled : notInJailRolledDoubles ? numDoublesRolled + 1 : 0
  }

}
