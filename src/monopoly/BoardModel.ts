
type Neighbour = {
  locationId : string;
  neighbourType? : string;
}

export enum SpecialLocationType {
  JAIL = 'JAIL',
  GOTO_JAIL = 'GOTO_JAIL'
}

export type Location = {
  id : string;
  name : string;
  type? : SpecialLocationType;
  coords : Array<number>;
  
  forwardNeighbours : Array<Neighbour>;
  cost? : number;
  rent? : number;
}

export interface BoardModel {
  getInitLocationId() : string;
  getLocation( locationId : string ) : Location;
}

export function getNextLocations(
    boardModel: BoardModel,
    locationId: string ) : Array<Neighbour> {
  return boardModel.getLocation(locationId)?.forwardNeighbours || [];
}

type LocationGroup = {
  name : string;
  locationIds : Array<string>;
}
