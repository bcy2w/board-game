import _assign from 'lodash/assign';
import React, {useState} from 'react';
import background from './board-background.svg';
import './Monopoly.css';
import Player from './Player';
import Property from './Property';
import PlayerInfoWidget from './PlayerInfoWidget';
import LocationInfoWidget from './LocationInfoWidget';
import LocationSaleWidget from './LocationSaleWidget';
import {
    TurnState
  , PlayerInfo
  , PlayerState, updatePlayerState, mapPlayerStateAction, getInitPlayerState
  , Ownership
  , LocationSaleState
  , GameStates, GameStatesMutators, GameStatesAction, mutateGameStates, INIT_GAME_STATES
  } from './GameStates';
import Dice from './Dice';
import {getNextLocations} from './BoardModel';
import {marioBoardModel} from './super-mario-bros/BoardModel';

const boardModel = marioBoardModel;
const initPlayerState = getInitPlayerState( boardModel );

function sleep( ms : number ) {
  return new Promise( r => setTimeout( r, ms ) );
}

type Props = {
  playersInfo : Array<PlayerInfo>;
}

////////////////////////////////////////////////////////////////////////

/**
 * Start a step if there is a step available.
 */
function maybeStartStep( playerState : PlayerState ) : PlayerState {
  if ( playerState.gotoLocationId || playerState.stepsAvailable < 1 ) {
    return playerState;
  }
  // Not in the process of stepping but there steps available.
  const nextLocations = getNextLocations( boardModel, playerState.locationId );
  const nextLocationId = nextLocations[0].locationId;
  return { ...playerState, 
      stepsAvailable: playerState.stepsAvailable - 1,
      gotoLocationId: nextLocationId
    };
}

////////////////////////////////////////////////////////////////////////

function Monopoly( props : Props ) {
  const [turnState,setTurnState] = useState( INIT_GAME_STATES.turnState );
  const [currentPlayerIndex,setCurrentPlayerIndex] = useState( INIT_GAME_STATES.currentPlayerIndex );
  const [playerStates,setPlayerStates] = useState( INIT_GAME_STATES.playerStates );
  const [ownershipMap,setOwnershipMap] = useState( INIT_GAME_STATES.ownershipMap );
  const [displayedPlayerId,setDisplayedPlayerId] = useState( INIT_GAME_STATES.displayedPlayerId );
  const [displayedLocationId,setDisplayedLocationId] = useState( INIT_GAME_STATES.displayedLocationId );
  const [canRollDice,setCanRollDice] = useState( INIT_GAME_STATES.canRollDice );
  const [locationSaleState,setLocationSaleState] = useState( INIT_GAME_STATES.locationSaleState );

  const gameStatesMutators : GameStatesMutators = {
    turnState : setTurnState,
    currentPlayerIndex : setCurrentPlayerIndex,
    playerStates : (s)=>sleep(100).then(()=>setPlayerStates(s)),
    ownershipMap : setOwnershipMap,
    displayedPlayerId : setDisplayedPlayerId,
    displayedLocationId : setDisplayedLocationId,
    canRollDice : setCanRollDice,
    locationSaleState : setLocationSaleState,
  }

  const gameStates0 = {
    turnState : turnState,
    currentPlayerIndex : currentPlayerIndex,
    playerStates : playerStates,
    ownershipMap : ownershipMap,
    displayedPlayerId : displayedPlayerId,
    displayedLocationId : displayedLocationId,
    canRollDice : canRollDice,
    locationSaleState : locationSaleState,
  }

  const newPlayerStatesEntries = props.playersInfo
      // Find players that don't already have states.
      .filter( p => !playerStates[p.playerId] )
      // Create a new state for each player.
      .map( p => [ p.playerId, { playerInfo : p, ...initPlayerState } ] );
  if ( newPlayerStatesEntries.length ) {
    setPlayerStates( {
      ...playerStates,
      ...Object.fromEntries(newPlayerStatesEntries)
    } );
    return<span>Adding Players...</span>;
  }

  const currentPlayerId = props.playersInfo[currentPlayerIndex].playerId;
  const currentPlayerState = playerStates[currentPlayerId];

  console.log('Monopoly', gameStates0);

  const gameStates = mapPlayerStateAction( maybeStartStep, gameStates0 );
  mutateGameStates( gameStatesMutators, gameStates0, gameStates );

  ////////////////////////////////////////////////////////////

  const doGameStatesAction = <T extends any>( action: GameStatesAction<T>, arg: T ) => {
    mutateGameStates( gameStatesMutators, gameStates, action( arg, gameStates ) );
  }

  ////////////////////////////////////////////////////////////

  return (
    <div className="monopoly">
      <img src={background} className="board-background" alt="background" />
      <div className="dice">
        <Dice disabled={!canRollDice}
            onRoll={(rolls: Array<number>)=>doGameStatesAction( handleDiceRoll, rolls )}
          />
      </div>
      { props.playersInfo.map( (playerInfo,index) =>
        <Player
            key={index}
            boardModel={boardModel}
            playerIndexAtLocation={index}
            playerState={playerStates[playerInfo.playerId]}
            isCurrentPlayer={playerInfo.playerId === currentPlayerId}
            onClick={()=>doGameStatesAction( handleSetUserInfoDisplay, playerInfo.playerId )}
            onStepEnd={()=>doGameStatesAction( handlePlayerStepEnd, playerInfo.playerId )}
          />
        )
      }
      { Object.keys( ownershipMap ).map( (locationId,index) =>
        <Property
            key={index}
            boardModel={boardModel}
            location={boardModel.getLocation(locationId)}
            ownerInfo={playerStates[ownershipMap[locationId].ownerId].playerInfo}
          />
        )
      }
      <div className="player-info">
        <PlayerInfoWidget boardModel={boardModel}
            playerState={displayedPlayerId ? playerStates[displayedPlayerId] : currentPlayerState}
          />
      </div>
      { turnState !== TurnState.ROLL_TO_START &&
        <div className="location-info">
          <LocationInfoWidget
              location={displayedLocationId ?
                  boardModel.getLocation( displayedLocationId ) :
                  boardModel.getLocation( currentPlayerState.locationId )
                }
            />
        </div>
      }
      { locationSaleState &&
        (<div className="location-sale">
          <LocationSaleWidget boardModel={boardModel}
              locationSaleState={locationSaleState}
              playerState={currentPlayerState}
              onBuy={(arg:LocationSaleState)=>doGameStatesAction( handleLocationSaleBuy, arg )}
              onDecline={()=>doGameStatesAction( handleLocationSaleDecline, undefined )}
            />
        </div>)
      }
    </div>
  );

  ////////////////////////////////////////////////////////////
  // Game States Actions

  /**
   * Change the Player Info Display to show the specified player.
   * @param playerId ID fo player to display
   * @param gameStates 
   * @returns 
   */
  function handleSetUserInfoDisplay( playerId: string, gameStates: GameStates ) : GameStates {
    return {...gameStates,
      displayedPlayerId : playerId
    };
  }

  function handleDiceRoll(
      rolls : Array<number>,
      gameStates : GameStates ) : GameStates {

    if ( gameStates.turnState !== TurnState.ROLL_TO_START ) {
      // Not time to roll.  Ignore.
      return gameStates;
    }

    // Add up the rolls
    const roll = rolls.reduce( (subtotal,roll)=>subtotal+roll, 0 );

    const nextLocations = getNextLocations( boardModel, currentPlayerState.locationId );
    const nextLocationId = nextLocations[0].locationId;

    // TODO: check if in prison

    const newPlayerStates = updatePlayerState(
      currentPlayerId,
      {
        stepsAvailable: roll - 1,
        gotoLocationId: nextLocationId
      },
      gameStates.playerStates
    );

    return { ...gameStates,
      turnState : TurnState.STEPPING,
      canRollDice : false,
      playerStates : newPlayerStates
    }

  }

  /**
   * Player has finished stepping to a new location.
   * @param index Player's index
   */
  function handlePlayerStepEnd ( playerId: string, gameStates: GameStates ) : GameStates {
    const playerState = gameStates.playerStates[ playerId ];
    const currentLocationId = playerState.gotoLocationId || playerState.locationId;

    const playerStateDelta : Partial<PlayerState> = {
      locationId : currentLocationId,
      gotoLocationId : undefined,
    };

    // TODO: Are we at Go?
    if ( currentLocationId === 'a-0' ) {
      playerStateDelta.cash = playerState.cash + 100
    }

    const newPlayerStates = updatePlayerState(
      playerId,
      playerStateDelta,
      gameStates.playerStates
    );

    const newGameStates = { ...gameStates,
      playerStates : newPlayerStates
    }

    if ( playerState.stepsAvailable < 1 ) {
      // We are done stepping.

      // TODO: handle actions at location
      if ( !ownershipMap[currentLocationId] ) {
        const location = boardModel.getLocation( currentLocationId );
        // Location is not owned
        if ( location?.cost !== undefined ) {
          // Location is ownable
          const locationSaleGameState = { ...newGameStates,
            turnState : TurnState.LOCATION_SALE,
            locationSaleState : {
              locationId : currentLocationId,
              playerId : playerId,
              askingPrice : location.cost,
              accepted : false
            }
          };
          return locationSaleGameState;
        } else {
          // Location is not ownable
          return handleTurnEnd( newGameStates );
        }

      } else {
        return handleTurnEnd( newGameStates );
      }

    }
    return newGameStates;
  }

  /**
   * Completes a Location sale.
   * @param locationSaleState 
   * @param gameStates 
   * @returns 
   */
  function handleLocationSaleBuy(
      locationSaleState : LocationSaleState,
      gameStates: GameStates ) : GameStates {

    // Pay the price
    const newPlayerStates = updatePlayerState(
      locationSaleState.playerId,
      {
        cash: currentPlayerState.cash - locationSaleState.askingPrice
      },
      gameStates.playerStates
    );

    // Create a new Ownership mapping.
    const newOwnershipMap = {...ownershipMap,
      [locationSaleState.locationId] : {
        locationId : locationSaleState.locationId,
        ownerId : locationSaleState.playerId,
        numPipes : 0,
        numCastles : 0
      }};

    return handleTurnEnd( { ...gameStates,
      playerStates : newPlayerStates,
      ownershipMap : newOwnershipMap,
      locationSaleState : undefined,
    } );

  }

  function handleLocationSaleDecline(
      __:void,
      gameStates: GameStates ) : GameStates {

    return handleTurnEnd( { ...gameStates,
      locationSaleState : undefined,
    } );

  }

  function handleTurnEnd( gameStates: GameStates ) : GameStates {
    return {
      ...gameStates,
      turnState : TurnState.ROLL_TO_START,
      currentPlayerIndex : (gameStates.currentPlayerIndex+1) % props.playersInfo.length,
      displayedPlayerId : null,
      canRollDice : true
    }
  }

}

export default Monopoly;
