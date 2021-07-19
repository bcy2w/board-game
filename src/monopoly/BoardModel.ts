
type Development = {
  name : string;
  cost : number;
  rent : number;
}

type Neighbour = {
  locationId : string;
  neighbourType? : string;
}

export type Location = {
  id : string;
  name : string;
  coords : Array<number>;
  
  forwardNeighbours : Array<Neighbour>;
  cost? : number;
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
