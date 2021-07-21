import _assign from 'lodash/assign';
import React, {useState} from 'react';
import './Monopoly.css';

import background from './board-background.svg';

import { handleSetUserInfoDisplay } from './logic/ui-controls';
import handleDiceRoll from './logic/handle-dice-rolls';
import handlePlayerStepEnd from './logic/handle-player-step-end';
import { handleLocationSaleBuy, handleLocationSaleDecline } from './logic/handle-location-buy';

import Player from './Player';
import Property from './Property';
import PlayerInfoWidget from './PlayerInfoWidget';
import LocationInfoWidget from './LocationInfoWidget';
import LocationSaleWidget from './LocationSaleWidget';
import {
    TurnState
  , PlayerInfo, PlayerState, mapPlayerStateAction, getInitPlayerState
  , LocationSaleState
  , GameStates, GameStatesMutators, GameStatesAction, mutateGameStates, INIT_GAME_STATES
  } from './GameStates';
import Dice from './Dice';
import {getNextLocations, } from './BoardModel';
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
  const [locationSaleState,setLocationSaleState] = useState( INIT_GAME_STATES.locationSaleState );
  const [numDoublesRolled,setNumDoublesRolled] = useState( INIT_GAME_STATES.numDoublesRolled );

  const gameStatesMutators : GameStatesMutators = {
    turnState : setTurnState,
    currentPlayerIndex : setCurrentPlayerIndex,
    playerStates : (s)=>sleep(100).then(()=>setPlayerStates(s)),
    ownershipMap : setOwnershipMap,
    displayedPlayerId : setDisplayedPlayerId,
    displayedLocationId : setDisplayedLocationId,
    locationSaleState : setLocationSaleState,
    numDoublesRolled : setNumDoublesRolled,
  }

  const gameStates0 = {
    turnState : turnState,
    currentPlayerIndex : currentPlayerIndex,
    playerStates : playerStates,
    ownershipMap : ownershipMap,
    displayedPlayerId : displayedPlayerId,
    displayedLocationId : displayedLocationId,
    locationSaleState : locationSaleState,
    numDoublesRolled : numDoublesRolled,
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

  // console.log('Monopoly', gameStates0);

  const gameStates = mapPlayerStateAction( maybeStartStep, gameStates0 );
  mutateGameStates( gameStatesMutators, gameStates0, gameStates );

  ////////////////////////////////////////////////////////////

  const doGameStatesAction = <T extends any>( action: GameStatesAction<T>, arg: T ) => {
    mutateGameStates( gameStatesMutators, gameStates, action( arg, gameStates ) );
  }

  ////////////////////////////////////////////////////////////

  const currentPlayerId = props.playersInfo[currentPlayerIndex].playerId;
  const currentPlayerState = gameStates.playerStates[currentPlayerId];

  return (
    <div className="monopoly">
      <img src={background} className="board-background" alt="background" />
      <div className="dice">
        <Dice disabled={turnState!==TurnState.TURN_START}
            onRoll={(rollValues: Array<number>) => doGameStatesAction(
              handleDiceRoll, {
                playersInfo: props.playersInfo,
                boardModel,
                currentPlayerId,
                rollValues } )}
          />
      </div>
      { props.playersInfo.map( (playerInfo,index) =>
        <Player
            key={index}
            boardModel={boardModel}
            playerIndexAtLocation={index}
            playerState={playerStates[playerInfo.playerId]}
            isCurrentPlayer={playerInfo.playerId === currentPlayerId}
            onClick={() => doGameStatesAction(
              handleSetUserInfoDisplay, {
                playerId : playerInfo.playerId
                } )}
            onStepEnd={() => doGameStatesAction(
              handlePlayerStepEnd, {
                playersInfo: props.playersInfo,
                boardModel,
                playerId : playerInfo.playerId } )}
          />
        )
      }
      { // These are all the owned locations.
        Object.keys( ownershipMap ).map( (locationId,index) => {
          const ownerId = ownershipMap[locationId].ownerId;
          return (<Property
              key={index}
              boardModel={boardModel}
              locationId={locationId}
              ownerInfo={playerStates[ownerId].playerInfo}
            />
          ) }
        )
      }
      <div className="player-info">
        <PlayerInfoWidget boardModel={boardModel}
            playerState={displayedPlayerId ? playerStates[displayedPlayerId] : currentPlayerState}
          />
      </div>
      { turnState !== TurnState.TURN_START &&
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
              onBuy={(locationSaleState:LocationSaleState) => doGameStatesAction(
                handleLocationSaleBuy, {
                  playersInfo: props.playersInfo,
                  boardModel,
                  locationSaleState } )}
              onDecline={() => doGameStatesAction(
                handleLocationSaleDecline, {
                  playersInfo: props.playersInfo,
                  boardModel } )}
            />
        </div>)
      }
    </div>
  );

  ////////////////////////////////////////////////////////////
  // Game States Actions


}

export default Monopoly;
