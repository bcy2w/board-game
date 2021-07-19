import { BoardModel } from "./BoardModel";

////////////////////////////////////////////////////////////
export enum TurnState {
  ROLL_TO_START,
  STEPPING,
  LOCATION_SALE,
  AUCTION,
  ENDABLE
}

////////////////////////////////////////////////////////////

export interface PlayerInfo {
  playerId : string;
  name : string;
  colour : string;
}

export type PlayerState = {
  playerInfo : PlayerInfo;

  cash : number;

  locationId : string;

  gotoLocationId? : string;
  stepsAvailable : number;
}


export function getInitPlayerState( boardModel : BoardModel ) : Omit<PlayerState, 'playerInfo'> {
  return {
    cash : 1000000,
    locationId : boardModel.getInitLocationId(),
    stepsAvailable : 0
  };
}

export type PlayerStateMap = Record<string,PlayerState>;

/**
 * Updates a player's state with a delta.
 */
export function updatePlayerState(
    playerId : string,
    stateDelta : Partial<PlayerState>,
    playerStates: PlayerStateMap
    ) : PlayerStateMap {
  const playerState = playerStates[playerId];

  return {...playerStates,
      [playerId] : {...playerState,...stateDelta}
    };
}

export type PlayerStateAction = (arg:PlayerState)=>PlayerState;

type PlayerStateFunctionState<A> = [A,PlayerState];
type PlayerStateFunction<A,B> = (arg:PlayerStateFunctionState<A>) => PlayerStateFunctionState<B>;

function mapPlayerStateAction_(
    playerStateAction : PlayerStateAction,
    playerStates : PlayerStateMap ) : PlayerStateMap {

  const playerStatesArray = Object.values( playerStates );
  const newPlayerStatesArray = playerStatesArray.map( playerStateAction );

  if ( playerStatesArray.every(
      (playerState,index) => playerState === newPlayerStatesArray[index]) ) {
    return playerStates;
  }

  const newPlayerStates = Object.fromEntries(newPlayerStatesArray.map( p => [p.playerInfo.playerId,p] ) );
  return newPlayerStates;
}

export function mapPlayerStateAction(
    playerStateAction : PlayerStateAction,
    gameStates : GameStates ) : GameStates {

  const playerStates = gameStates.playerStates;
  const newPlayerStates = mapPlayerStateAction_( playerStateAction, playerStates );

  return playerStates === newPlayerStates ? gameStates :
      {...gameStates, playerStates:newPlayerStates};
}

////////////////////////////////////////////////////////////

export type LocationSaleState = {
  locationId : string;
  playerId : string;
  askingPrice : number;
  accepted : boolean;
}

////////////////////////////////////////////////////////////

export type Ownership = {
  locationId : string;
  ownerId : string;

  numPipes : number;
  numCastles : number;
}
export type OwnershipMap = Record<string,Ownership>;

////////////////////////////////////////////////////////////

export type GameStates = {
  turnState : TurnState,
  currentPlayerIndex : number;
  playerStates : PlayerStateMap;
  ownershipMap : OwnershipMap;
  displayedPlayerId : string|null;
  displayedLocationId : string|null;
  canRollDice : boolean;
  locationSaleState? : LocationSaleState;
}
export const INIT_GAME_STATES : GameStates = {
  turnState : TurnState.ROLL_TO_START,
  currentPlayerIndex : 0,
  playerStates : {},
  ownershipMap : {},
  displayedPlayerId : null,
  displayedLocationId : null,
  canRollDice : true,
}

/**
 * A map of mutators for the game states.
 */
export type GameStatesMutators = Record<keyof GameStates, (a:any)=>void>;

/**
 * Compares each game state and call its mutator if it has changed.
 * @param gameStatesMutator
 * @param gameStatesBefore 
 * @param gameStatesAfter 
 */
export const mutateGameStates = (
    gameStatesMutator : GameStatesMutators,
    gameStatesBefore : GameStates,
    gameStatesAfter : GameStates ) => {

  // Check for states that have changed or are added.
  (Object.keys( gameStatesAfter ) as Array<keyof GameStates>)
    .forEach( k => {
      if ( gameStatesBefore[k] !== gameStatesAfter[k] ) {
//        console.log( 'Setting ' + k, gameStatesAfter[k] )
        gameStatesMutator[k]( gameStatesAfter[k] );
      }
    } );

  // Check for states that have been removed.
  (Object.keys( gameStatesBefore ) as Array<keyof GameStates>)
    .forEach( k => {
      if ( gameStatesBefore[k] && gameStatesAfter[k] === undefined ) {
//        console.log( 'Unsetting ' + k )
        gameStatesMutator[k]( undefined );
      }
    } );
}

export type GameStatesAction<T> = (arg: T, gameStates: GameStates) => GameStates;

const doGameStatesAction = <T>(
    gameStatesMutators: GameStatesMutators,
    gameStatesAction : GameStatesAction<T>,
    arg: T,
    gameStates: GameStates ) => {
  mutateGameStates( gameStatesMutators, gameStates,
      gameStatesAction( arg, gameStates ) );
}
