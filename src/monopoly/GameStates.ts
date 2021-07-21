import { EndoFn, Fn } from './logic/fp';
import { BoardModel } from './BoardModel';

////////////////////////////////////////////////////////////
export enum TurnState {
  TURN_START,
  IN_JAIL,
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
  stepsAvailable : number;

  numTurnsInJail? : number;

  gotoLocationId? : string;
}


export function getInitPlayerState( boardModel : BoardModel ) : Omit<PlayerState, 'playerInfo'> {
  return {
    cash : 2000,
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

export const playerStatesAction = (
    playerId : string,
    stateDelta : Partial<PlayerState>
  ) : EndoFn<PlayerStateMap> =>
  playerStates => updatePlayerState( playerId, stateDelta, playerStates );

type PlayerStateF<A> = [PlayerState,A];
type PlayerStateFn<A,B> = Fn<PlayerStateF<A>,PlayerStateF<B>>;

const playerStatePipe = <A>(...fns: Array<PlayerStateFn<any,any>>) =>
  (initValue: PlayerStateF<A>) => fns.reduce( (value,fn) => fn(value), initValue );

export type PlayerStateAction = (arg:PlayerState)=>PlayerState;

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

export function updatePlayerCashAction(
    playerState: PlayerState,
    amount: number ): EndoFn<PlayerStateMap> {
  return playerStatesAction(
      playerState.playerInfo.playerId, { cash: playerState.cash - amount } );
}

type PlayerStatesF<A> = [PlayerStateMap, Record<string,A>];
type PlayerStatesFn<A,B> = Fn<PlayerStatesF<A>,PlayerStatesF<B>>;

function playerStatesFmap<A,B>( f : PlayerStateFn<A,B> ): PlayerStatesFn<A,B> {
  return ( [playerStates,valuesMap] ) => {
    const resultsArray : Array<[PlayerState,B]> = Object.entries( valuesMap )
      .filter( ([playerId]) => playerStates[playerId] )
      .map( ([playerId,value]) => f( [playerStates[playerId],value] ) );

    // Create new PlayerStateMap if anyone's state has changed.
    const resultPlayerStates : PlayerStateMap = resultsArray.every(
          ([s]) => s === playerStates[s.playerInfo.playerId] ) ?
        playerStates :
        Object.fromEntries(resultsArray.map( ([s]) => [s.playerInfo.playerId,s] ) );

    const results : Record<string,B> = Object.fromEntries(
        resultsArray.map( ([s,value]) => [s.playerInfo.playerId, value] ) );

    return [resultPlayerStates,results];
  }
}

////////////////////////////////////////////////////////////

export type LocationSaleState = {
  locationId : string;
  playerId : string;
  askingPrice : number;
  accepted : boolean;
}

////////////////////////////////////////////////////////////

type Development = {
  type : string;
  value : number;
  rent : number;
}

export type Ownership = {
  locationId : string;
  ownerId : string;

  numPipes : number;
  numCastles : number;
  developements? : Array<Development>
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
  locationSaleState? : LocationSaleState;

  numDoublesRolled : number;
}
export const INIT_GAME_STATES : GameStates = {
  turnState : TurnState.TURN_START,
  currentPlayerIndex : 0,
  playerStates : {},
  ownershipMap : {},
  displayedPlayerId : null,
  displayedLocationId : null,

  numDoublesRolled : 0,
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
