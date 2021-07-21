import { endoPipe } from './fp';
import { BoardModel, Location, SpecialLocationType } from '../BoardModel';
import {
    PlayerInfo, PlayerState,
    playerStatesAction, updatePlayerCashAction,
    Ownership,
    GameStates, TurnState
  } from '../GameStates';
import handleTurnEnd from './handle-turn-end';

interface Params {
  playersInfo : Array<PlayerInfo>;
  boardModel : BoardModel;
  playerId : string,
}

export default function handlePlayerLocationLanding( {
    playersInfo,
    boardModel,
    playerId
  } : Params,
  gameStates : GameStates ): GameStates {

    console.log( 'ZZZ landing', gameStates)

  const playerState = gameStates.playerStates[playerId];
  const currentLocationId = playerState.locationId;
  const location = boardModel.getLocation( currentLocationId );

  if ( gameStates.ownershipMap[currentLocationId] ) {
    // Somebody owns this location.
    const ownership = gameStates.ownershipMap[ currentLocationId ];

    if ( playerId === ownership.ownerId ) {
      // You own it.
      return handleTurnEnd( playersInfo, boardModel, gameStates );
    }

    // Pay the rent.
    const rent = calculateRent( location, ownership );
    const ownerState = gameStates.playerStates[ownership.ownerId]
    const playerStatesActions = [
        updatePlayerCashAction( playerState, -rent ),
        updatePlayerCashAction( ownerState, rent )
      ];

    return handleTurnEnd( playersInfo, boardModel,
      { ...gameStates,
        playerStates : endoPipe(...playerStatesActions)(gameStates.playerStates),
      } );

  } else {
    // Location is not owned

    // Is the location ownable?
    if ( location?.cost !== undefined ) {
      // Then start a sale.
      return { ...gameStates,
        turnState : TurnState.LOCATION_SALE,
        locationSaleState : {
          locationId : currentLocationId,
          playerId : playerId,
          askingPrice : location.cost,
          accepted : false
        }
      };
    }

    // Are we going to jail?
    if ( location?.type === SpecialLocationType.GOTO_JAIL ) {
      const playerStatesChange = playerStatesAction( playerId, {
          locationId : 'jail',
        } );
      return handleTurnEnd( playersInfo, boardModel,
        { ...gameStates,
          playerStates : playerStatesChange( gameStates.playerStates ),
          numDoublesRolled : 0
        } );
    }

    // Location is not ownable
    return handleTurnEnd( playersInfo, boardModel, gameStates );
  }
}

function calculateRent( location : Location, ownership : Ownership) : number {
  return location.rent || 0;
}