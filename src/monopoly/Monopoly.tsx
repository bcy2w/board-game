import _assign from 'lodash/assign';
import React, {useState} from 'react';
import background from './board-background.svg';
import './Monopoly.css';
import Player from './Player';
import PlayerInfoWidget from './PlayerInfoWidget';
import {
    PlayerInfo
  , PlayerState, PlayerStateMap, INIT_PLAYER_STATE
  , GameStates, GameStatesMutators, mutateGameStates, INIT_GAME_STATES
  } from './GameStates';
import Dice from './Dice';
import BoardModel from './BoardModel';

const boardModel = new BoardModel();

function sleep( ms : number ) {
  return new Promise( r => setTimeout( r, ms ) );
}

type Props = {
  playersInfo : Array<PlayerInfo>;
}

function mapPlayerStateAction(
    playerStateAction : (s:PlayerState)=>PlayerState,
    gameStates : GameStates ) : GameStates {
  const playerStatesArray = Object.values( gameStates.playerStates );

  const newPlayerStatesArray = playerStatesArray.map( playerStateAction );

  if ( playerStatesArray.some(
      (playerState,index) => playerState !== newPlayerStatesArray[index]) ) {

    const newPlayerStates = Object.fromEntries(newPlayerStatesArray.map( p => [p.playerInfo.playerId,p] ) );
    return {...gameStates, playerStates:newPlayerStates}

  }
  return gameStates;
}

function assocPlayerState(
    playerStates: PlayerStateMap,
    playerId : string,
    playerState : PlayerState ) : PlayerStateMap {
  return {...playerStates, [playerId]:playerState};
}

function updatePlayerState(
    playerStates: PlayerStateMap,
    playerId : string,
    stateDelta : Partial<PlayerState> ) : PlayerStateMap {
  const playerState = playerStates[playerId];
  return assocPlayerState(playerStates,playerId,{...playerState,...stateDelta});
}

////////////////////////////////////////////////////////////////////////

function maybeStartStep( playerState : PlayerState ) : PlayerState {
  if ( !playerState.gotoLocationId && playerState.stepsAvailable >= 1 ) {
    const nextLocations = boardModel.getNextLocations( playerState.locationId );
    const nextLocationId = nextLocations[0].locationId;
    return _assign( {}, playerState, {
      stepsAvailable: playerState.stepsAvailable - 1,
      gotoLocationId: nextLocationId
    } );
  }
  return playerState;
}

////////////////////////////////////////////////////////////////////////

function Monopoly( props : Props ) {
  const [currentPlayerIndex,setCurrentPlayerIndex] = useState( INIT_GAME_STATES.currentPlayerIndex );

  const [playerStates,setPlayerStates] = useState( INIT_GAME_STATES.playerStates );

  const [ownershipAssignments,setOwnershipAssignments] = useState( INIT_GAME_STATES.ownershipAssignments );

  const [canRollDice,setCanRollDice] = useState( true );

  const gameStatesMutators : GameStatesMutators = {
    currentPlayerIndex : setCurrentPlayerIndex,
    playerStates : (s)=>sleep(100).then(()=>setPlayerStates(s)),
    ownershipAssignments : setOwnershipAssignments,
    canRollDice : setCanRollDice,
  }

  const gameStates = {
    currentPlayerIndex : currentPlayerIndex,
    playerStates : playerStates,
    ownershipAssignments : ownershipAssignments,
    canRollDice : canRollDice,
  }

  const newPlayerStatesEntries = props.playersInfo
      // Find players that don't already have states.
      .filter( p => !playerStates[p.playerId] )
      // Create a new state for the players.
      .map( p => [ p.playerId, { playerInfo : p, ...INIT_PLAYER_STATE } ] );
  if ( newPlayerStatesEntries.length ) {
    setPlayerStates( {
      ...playerStates,
      ...Object.fromEntries(newPlayerStatesEntries)
    } );
    return<span>Adding Players...</span>;
  }
  const currentPlayerId = props.playersInfo[currentPlayerIndex].playerId;
  const currentPlayerState = playerStates[currentPlayerId];

  console.log('Monopoly', gameStates);

  const gameStates2 = mapPlayerStateAction( maybeStartStep, gameStates );
  mutateGameStates( gameStatesMutators, gameStates, gameStates2 );

  ////////////////////////////////////////////////////////////
  function doDiceRoll(
      rolls : Array<number>,
      playerId : string,
      gameStates : GameStates ) : GameStates {

    const roll = rolls.reduce( (subtotal,roll)=>subtotal+roll, 0 );

    const playerState = gameStates.playerStates[playerId];

    const nextLocations = boardModel.getNextLocations( playerState.locationId );
    const nextLocationId = nextLocations[0].locationId;

    // TODO: check if in prison

    const newPlayerStates = updatePlayerState(
      gameStates.playerStates,
      playerId,
      {
        stepsAvailable: roll - 1,
        gotoLocationId: nextLocationId
      }
    );

    return { ...gameStates,
      canRollDice : false,
      playerStates : newPlayerStates
    }

  }

  /**
   * 
   * @param index Player's index
   */
  const doPlayerStepEnd = ( playerId: string, gameStates: GameStates ) : GameStates => {
    const playerState = gameStates.playerStates[ playerId];
    const currentLocationId = playerState.gotoLocationId || playerState.locationId;

// console.log( 'Step end! ' + playerId, gameStates.playerStates[playerId])
    const playerStateDelta = {
      locationId : currentLocationId,
      gotoLocationId : undefined,
    };

    // TODO: Are we at Go?

    const newPlayerStates = updatePlayerState(
      gameStates.playerStates,
      playerId,
      playerStateDelta
    );

    const newGameStates = { ...gameStates,
      playerStates : newPlayerStates
    }

    if ( playerState.stepsAvailable < 1 ) {
      // TODO: handle actions at location

      return doTurnEnd( newGameStates );
    }
    return newGameStates;
  }

  function doTurnEnd( gameStates: GameStates ) : GameStates {
    return {
      ...gameStates,
      currentPlayerIndex : (gameStates.currentPlayerIndex+1) % props.playersInfo.length,
      canRollDice : true
    }
  }

  ////////////////////////////////////////////////////////////

  const handleDiceRoll = (rolls : Array<number> ) => {
    mutateGameStates( gameStatesMutators, gameStates2,
        doDiceRoll( rolls, currentPlayerId, gameStates2 ) );
  }

  /**
   * 
   * @param index Player's index
   */
  const handlePlayerStepEnd = ( playerId:string ) => {
    mutateGameStates( gameStatesMutators, gameStates2,
        doPlayerStepEnd( playerId, gameStates2 ) );
  }

  return (
    <div className="monopoly">
      <img src={background} className="board-background" alt="background" />
      { props.playersInfo.map( (playerInfo,index) =>
        <Player
            key={index}
            boardModel={boardModel}
            playerIndexAtLocation={index}
            playerState={playerStates[playerInfo.playerId]}
            onStepEnd={handlePlayerStepEnd.bind(null,playerInfo.playerId)}
          />
        )
      }
      <div className="player-info">
        <PlayerInfoWidget
            playerNumber={currentPlayerIndex}
            boardModel={boardModel}
            playerState={currentPlayerState}
          />
      </div>
      <div className="dice">
        <Dice onRoll={handleDiceRoll} disabled={!canRollDice}/>
      </div>
    </div>
  );
}

export default Monopoly;
