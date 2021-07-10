
const coordinates = [
  [600,600], [540,600], [480,600], [420,600], [360,600],
  [300,600], [240,600], [180,600], [120,600], [60,600],
  [0,600], [0,540], [0,480], [0,420], [0,360],
  [0,300], [0,240], [0,180], [0,120], [0,60], 
  [0,0], [60,0], [120,0], [180,0], [240,0],
  [300,0], [360,0], [420,0], [480,0], [540,0],
  [600,0], [600,60], [600,120], [600,180], [600,240],
  [600,300], [600,360], [600,420], [600,480], [600,540]
];

type Development = {
  name : string;
  cost : number;
  rent : number;
}

type Exit = {
  locationId : string;
  exitId? : string;
}

type Location = {
  id : string;
  name : string;
  coords : Array<number>;
  
  exits : Array<Exit>;
  cost? : number;
}

const locationsArray : Array<Location> = [
  {
    id : 'a-0', coords : coordinates[0], name : 'Go',
    exits : [{locationId:'a-1'}]
  },{
    id : 'a-1', coords : coordinates[1], name : 'World 1-1',
    exits : [{locationId:'a-2'}], cost : 60
  },{
    id : 'a-2', coords : coordinates[2], name : 'Warp Pipe',
    exits : [{locationId:'a-3'}]
  },{
    id : 'a-3', coords : coordinates[3], name : 'World 1-4',
    exits : [{locationId:'a-4'}], cost : 60
  },{
    id : 'a-4', coords : coordinates[4], name : 'Attacked by a Goomba',
    exits : [{locationId:'a-5'}], cost : 60
  },{
    id : 'a-5', coords : coordinates[5], name : 'Vine',
    exits : [{locationId:'a-6'}], cost : 60
  },{
    id : 'a-6', coords : coordinates[6], name : 'World 2-1',
    exits : [{locationId:'a-7'}], cost : 60
  },{
    id : 'a-7', coords : coordinates[7], name : '? Block',
    exits : [{locationId:'a-8'}], cost : 60
  },{
    id : 'a-8', coords : coordinates[8], name : 'World 2-2',
    exits : [{locationId:'a-9'}], cost : 60
  },{
    id : 'a-9', coords : coordinates[9], name : 'World 2-4',
    exits : [{locationId:'b-0'}], cost : 60
  },{
    id : 'b-0', coords : coordinates[10], name : 'Just Visiting',
    exits : [{locationId:'b-1'}],
  },{
    id : 'b-0-jail', coords : [30,600], name : 'In Jail',
    exits : [{locationId:'World 2-1'}], cost : 60
  },{
    id : 'World 2-1', coords : coordinates[11], name : 'World 2-1',
    exits : [{locationId:'2-2'}], cost : 60
  },{
    id : 'b-2', coords : coordinates[12], name : '2-2',
    exits : [{locationId:'b-3'}], cost : 60
  },{
    id : 'b-3', coords : coordinates[13], name : '2-4',
    exits : [{locationId:'b-4'}], cost : 60
  },{
    id : 'b-4', coords : coordinates[14], name : 'B-4',
    exits : [{locationId:'b-5'}], cost : 60
  },{
    id : 'b-5', coords : coordinates[15], name : 'B-5',
    exits : [{locationId:'b-6'}], cost : 60
  },{
    id : 'b-6', coords : coordinates[16], name : 'B-6',
    exits : [{locationId:'b-7'}], cost : 60
  },{
    id : 'b-7', coords : coordinates[17], name : 'B-7',
    exits : [{locationId:'b-8'}], cost : 60
  },{
    id : 'b-8', coords : coordinates[18], name : 'B-8',
    exits : [{locationId:'b-9'}], cost : 60
  },{
    id : 'b-9', coords : coordinates[19], name : 'B-9',
    exits : [{locationId:'c-0'}], cost : 60
  },{
    id : 'c-0', coords : coordinates[20], name : 'Free Parking',
    exits : [{locationId:'c-1'}],
  },{
    id : 'c-1', coords : coordinates[21], name : 'c-1',
    exits : [{locationId:'c-2'}], cost : 60
  },{
    id : 'c-2', coords : coordinates[22], name : 'c-2',
    exits : [{locationId:'c-3'}], cost : 60
  },{
    id : 'c-3', coords : coordinates[23], name : 'c-3',
    exits : [{locationId:'c-4'}], cost : 60
  },{
    id : 'c-4', coords : coordinates[24], name : 'c-4',
    exits : [{locationId:'c-5'}], cost : 60
  },{
    id : 'c-5', coords : coordinates[25], name : 'c-5',
    exits : [{locationId:'c-6'}], cost : 60
  },{
    id : 'c-6', coords : coordinates[26], name : 'c-6',
    exits : [{locationId:'c-7'}], cost : 60
  },{
    id : 'c-7', coords : coordinates[27], name : 'c-7',
    exits : [{locationId:'c-8'}], cost : 60
  },{
    id : 'c-8', coords : coordinates[28], name : 'c-8',
    exits : [{locationId:'c-9'}], cost : 60
  },{
    id : 'c-9', coords : coordinates[29], name : 'c-9',
    exits : [{locationId:'d-0'}], cost : 60
  },{
    id : 'd-0', coords : coordinates[30], name : 'Go to Jail',
    exits : [{locationId:'d-1'}],
  },{
    id : 'd-1', coords : coordinates[31], name : 'd-1',
    exits : [{locationId:'d-2'}], cost : 60
  },{
    id : 'd-2', coords : coordinates[32], name : 'd-2',
    exits : [{locationId:'d-3'}], cost : 60
  },{
    id : 'd-3', coords : coordinates[33], name : 'd-3',
    exits : [{locationId:'d-4'}], cost : 60
  },{
    id : 'd-4', coords : coordinates[34], name : 'd-4',
    exits : [{locationId:'d-5'}], cost : 60
  },{
    id : 'd-5', coords : coordinates[35], name : 'd-5',
    exits : [{locationId:'d-6'}], cost : 60
  },{
    id : 'd-6', coords : coordinates[36], name : 'd-6',
    exits : [{locationId:'d-7'}], cost : 60
  },{
    id : 'd-7', coords : coordinates[37], name : 'World 8-1',
    exits : [{locationId:'d-8'}], cost : 60
  },{
    id : 'd-8', coords : coordinates[38], name : 'Attacked by Bullet Bill',
    exits : [{locationId:'d-9'}]
  },{
    id : 'd-9', coords : coordinates[39], name : 'World 8-4',
    exits : [{locationId:'a-0'}], cost : 400
  }
];

type LocationGroup = {
  name : string;
  locationIds : Array<string>;
}

const locations : Record<string,Location> =
    Object.fromEntries(locationsArray.map(l=>[l.id,l]));

export const INIT_LOCATION_ID = 'a-0';

export default class BoardModel {

  getLocation( locationId : string ) : Location {
    return locations[locationId];
  }

  getLocationName( locationId : string ) : string {
    return locations[locationId]?.name;
  }

  getCoordinates( locationId : string ) : Array<number> {
    return locations[locationId]?.coords;
  }

  getNextLocations( locationId : string ) : Array<Exit> {
    // console.log( 'Currently at', locations[locationId])
    return locations[locationId]?.exits;
  }

}