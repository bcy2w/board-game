import BoardModel, { INIT_LOCATION_ID } from "./BoardModel";

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

export type PlayerStateDefault = Omit<PlayerState, 'playerInfo'>;

export type PlayerStateMap = Record<string,PlayerState>;

export const INIT_PLAYER_STATE : PlayerStateDefault = {
  cash : 0,

  locationId : INIT_LOCATION_ID,

  stepsAvailable : 0
}

export type Ownership = {
  locationId : string;
  ownerId : string;

  numPipes : number;
  numCastles : number;
}

export type GameStates = {
  currentPlayerIndex : number;
  playerStates : PlayerStateMap;
  ownershipAssignments : Record<string,Ownership>;
  canRollDice : boolean
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
}

export const INIT_GAME_STATES : GameStates = {
  currentPlayerIndex : 0,
  playerStates : {},
  ownershipAssignments : {},
  canRollDice : true,
}
