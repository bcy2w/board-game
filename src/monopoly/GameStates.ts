import BoardModel, { INIT_LOCATION_ID } from "./BoardModel";

////////////////////////////////////////////////////////////

export interface PlayerInfo {
  playerId : string;
  name : string;
}

export type PlayerState = {
  playerInfo : PlayerInfo;

  cash : number;

  locationId : string;

  gotoLocationId? : string;
  stepsAvailable : number;
}

export const INIT_PLAYER_STATE : Omit<PlayerState, 'playerInfo'> = {
  cash : 1000000,
  locationId : INIT_LOCATION_ID,
  stepsAvailable : 0
}

export type PlayerStateMap = Record<string,PlayerState>;

export type PlayerStateAction = (arg:PlayerState)=>PlayerState;

export function mapPlayerStateAction(
    playerStateAction : PlayerStateAction,
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
  currentPlayerIndex : number;
  playerStates : PlayerStateMap;
  ownershipMap : OwnershipMap;
  canRollDice : boolean;
  locationSaleState? : LocationSaleState;
}

export type GameStatesMutators = Record<keyof GameStates, (a:any)=>void>;

export const mutateGameStates = (
    gameStateMutator : GameStatesMutators,
    gameStateBefore : GameStates,
    gameStateAfter : GameStates ) => {
  (Object.keys( gameStateAfter ) as Array<keyof GameStates>)
    .forEach( k => {
      if ( gameStateBefore[k] !== gameStateAfter[k] ) {
        console.log( 'Setting ' + k, gameStateAfter[k] )
        gameStateMutator[k]( gameStateAfter[k] );
      }
    } );
  (Object.keys( gameStateBefore ) as Array<keyof GameStates>)
    .forEach( k => {
      if ( gameStateBefore[k] && gameStateAfter[k] === undefined ) {
        console.log( 'Unsetting ' + k )
        gameStateMutator[k]( undefined );
      }
    } );
}
export type GameStatesAction<T> = (arg: T, gameStates: GameStates) => GameStates;

export const doGameStatesAction = <T>(
    gameStatesAction : GameStatesAction<T>,
    gameStatesMutators: GameStatesMutators,
    arg: T,
    gameStates: GameStates ) => {
  mutateGameStates( gameStatesMutators, gameStates,
      gameStatesAction( arg, gameStates ) );
}

export const INIT_GAME_STATES : GameStates = {
  currentPlayerIndex : 0,
  playerStates : {},
  ownershipMap : {},
  canRollDice : true,
}
