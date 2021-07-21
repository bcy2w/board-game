import { EndoFn, endoPipe } from './fp';
import { BoardModel } from '../BoardModel';
import {
    PlayerInfo, updatePlayerState,
    LocationSaleState,
    GameStates,
  } from '../GameStates';
import handleTurnEnd from './handle-turn-end';

interface BuyParams {
  playersInfo : Array<PlayerInfo>;
  boardModel : BoardModel;
  locationSaleState : LocationSaleState,
}

/**
 * Completes a Location sale.
 * @param locationSaleState 
 * @param gameStates 
 * @returns 
 */
export function handleLocationSaleBuy( {
      playersInfo,
      boardModel,
      locationSaleState,
    } : BuyParams,
    gameStates: GameStates ) : GameStates {

  const playerState = gameStates.playerStates[locationSaleState.playerId];

  // Pay the price
  const newPlayerStates = updatePlayerState(
    locationSaleState.playerId,
    {
      cash: playerState.cash - locationSaleState.askingPrice
    },
    gameStates.playerStates
  );

  // Create a new Ownership mapping.
  const newOwnershipMap = {...gameStates.ownershipMap,
    [locationSaleState.locationId] : {
      locationId : locationSaleState.locationId,
      ownerId : locationSaleState.playerId,
      numPipes : 0,
      numCastles : 0
    }};

  return handleTurnEnd( playersInfo, boardModel,
    { ...gameStates,
      playerStates : newPlayerStates,
      ownershipMap : newOwnershipMap,
      locationSaleState : undefined,
    } );

}

interface DeclineParams {
  playersInfo : Array<PlayerInfo>;
  boardModel : BoardModel;
}

export function handleLocationSaleDecline(
    { playersInfo, boardModel } : DeclineParams,
    gameStates: GameStates ) : GameStates {

  return handleTurnEnd( playersInfo, boardModel,
    { ...gameStates,
      locationSaleState : undefined,
    } );

}
