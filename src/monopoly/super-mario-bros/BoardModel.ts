import {BoardModel, Location, SpecialLocationType} from '../BoardModel';

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

const locationsArray : Array<Location> = [
  {
    id : 'a-0', coords : coordinates[0], name : 'Go',
    forwardNeighbours : [{locationId:'a-1'}],
  },{
    id : 'a-1', coords : coordinates[1], name : 'World 1-1',
    forwardNeighbours : [{locationId:'a-2'}], cost : 60,
    rent : 2,
  },{
    id : 'a-2', coords : coordinates[2], name : 'Warp Pipe',
    forwardNeighbours : [{locationId:'a-3'}],
  },{
    id : 'a-3', coords : coordinates[3], name : 'World 1-4',
    forwardNeighbours : [{locationId:'a-4'}], cost : 60,
    rent : 4,
  },{
    id : 'a-4', coords : coordinates[4], name : 'Attacked by a Goomba',
    forwardNeighbours : [{locationId:'a-5'}], 
  },{
    id : 'a-5', coords : coordinates[5], name : 'Vine',
    forwardNeighbours : [{locationId:'a-6'}], cost : 200,
    rent : 25,
  },{
    id : 'a-6', coords : coordinates[6], name : 'World 2-1',
    forwardNeighbours : [{locationId:'a-7'}], cost : 100,
    rent : 6,
  },{
    id : 'a-7', coords : coordinates[7], name : '? Block',
    forwardNeighbours : [{locationId:'a-8'}], 
  },{
    id : 'a-8', coords : coordinates[8], name : 'World 2-2',
    forwardNeighbours : [{locationId:'a-9'}], cost : 100,
    rent : 6,
  },{
    id : 'a-9', coords : coordinates[9], name : 'World 2-4',
    forwardNeighbours : [{locationId:'b-0'}], cost : 120,
    rent : 8,
  },{
    id : 'b-0', coords : coordinates[10], name : 'Just Visiting',
    forwardNeighbours : [{locationId:'b-1'}],
  },{
    id : 'jail', coords : [60,540], name : 'In Jail',
    type : SpecialLocationType.JAIL,
    forwardNeighbours : [{locationId:'b-1'}],
  },{
    id : 'b-1', coords : coordinates[11], name : 'World 3-1',
    forwardNeighbours : [{locationId:'b-2'}], cost : 140,
    rent : 10,
  },{
    id : 'b-2', coords : coordinates[12], name : 'Fire Flower',
    forwardNeighbours : [{locationId:'b-3'}], cost : 150
  },{
    id : 'b-3', coords : coordinates[13], name : 'World 3-3',
    forwardNeighbours : [{locationId:'b-4'}], cost : 140,
    rent : 10,
  },{
    id : 'b-4', coords : coordinates[14], name : 'World 3-4',
    forwardNeighbours : [{locationId:'b-5'}], cost : 160,
    rent : 12,
  },{
    id : 'b-5', coords : coordinates[15], name : 'Lift',
    forwardNeighbours : [{locationId:'b-6'}], cost : 200,
    rent : 25,
  },{
    id : 'b-6', coords : coordinates[16], name : 'World 4-1',
    forwardNeighbours : [{locationId:'b-7'}], cost : 180,
    rent : 14,
  },{
    id : 'b-7', coords : coordinates[17], name : 'Warp Pipe',
    forwardNeighbours : [{locationId:'b-8'}], 
  },{
    id : 'b-8', coords : coordinates[18], name : 'World 4-3',
    forwardNeighbours : [{locationId:'b-9'}], cost : 180,
    rent : 14,
  },{
    id : 'b-9', coords : coordinates[19], name : 'World 4-4',
    forwardNeighbours : [{locationId:'c-0'}], cost : 200,
    rent : 16,
  },{
    id : 'c-0', coords : coordinates[20], name : 'Free Parking',
    forwardNeighbours : [{locationId:'c-1'}],
  },{
    id : 'c-1', coords : coordinates[21], name : 'World 5-1',
    forwardNeighbours : [{locationId:'c-2'}], cost : 220,
    rent : 18,
  },{
    id : 'c-2', coords : coordinates[22], name : '? BLock',
    forwardNeighbours : [{locationId:'c-3'}], 
  },{
    id : 'c-3', coords : coordinates[23], name : 'World 5-3',
    forwardNeighbours : [{locationId:'c-4'}], cost : 220,
    rent : 18,
  },{
    id : 'c-4', coords : coordinates[24], name : 'World 5-4',
    forwardNeighbours : [{locationId:'c-5'}], cost : 240,
    rent : 20,
  },{
    id : 'c-5', coords : coordinates[25], name : 'Cloud Lift',
    forwardNeighbours : [{locationId:'c-6'}], cost : 200,
    rent : 25,
  },{
    id : 'c-6', coords : coordinates[26], name : 'World 6-1',
    forwardNeighbours : [{locationId:'c-7'}], cost : 260,
    rent : 22,
  },{
    id : 'c-7', coords : coordinates[27], name : 'World 6-2',
    forwardNeighbours : [{locationId:'c-8'}], cost : 260,
    rent : 22,
  },{
    id : 'c-8', coords : coordinates[28], name : 'Super Star',
    forwardNeighbours : [{locationId:'c-9'}], cost : 150
  },{
    id : 'c-9', coords : coordinates[29], name : '6-4',
    forwardNeighbours : [{locationId:'d-0'}], cost : 280,
    rent : 24,
  },{
    id : 'd-0', coords : coordinates[30], name : 'Go to Jail',
    type : SpecialLocationType.GOTO_JAIL,
    forwardNeighbours : [{locationId:'d-1'}],
  },{
    id : 'd-1', coords : coordinates[31], name : 'World 7-1',
    forwardNeighbours : [{locationId:'d-2'}], cost : 300,
    rent : 26,
  },{
    id : 'd-2', coords : coordinates[32], name : 'World 7-3',
    forwardNeighbours : [{locationId:'d-3'}], cost : 300,
    rent: 26,
  },{
    id : 'd-3', coords : coordinates[33], name : 'Warp Pipe',
    forwardNeighbours : [{locationId:'d-4'}], 
  },{
    id : 'd-4', coords : coordinates[34], name : '7-4',
    forwardNeighbours : [{locationId:'d-5'}], cost : 320,
    rent : 28,
  },{
    id : 'd-5', coords : coordinates[35], name : 'Trampoline',
    forwardNeighbours : [{locationId:'d-6'}], cost : 200,
    rent : 25,
  },{
    id : 'd-6', coords : coordinates[36], name : '? Block',
    forwardNeighbours : [{locationId:'d-7'}], 
  },{
    id : 'd-7', coords : coordinates[37], name : 'World 8-1',
    forwardNeighbours : [{locationId:'d-8'}], cost : 350,
    rent : 35,
  },{
    id : 'd-8', coords : coordinates[38], name : 'Attacked by Bullet Bill',
    forwardNeighbours : [{locationId:'d-9'}]
  },{
    id : 'd-9', coords : coordinates[39], name : 'World 8-4',
    forwardNeighbours : [{locationId:'a-0'}], cost : 400,
    rent : 35,
  }
];

const initLocationId = 'a-0';

const locations : Record<string,Location> =
    Object.fromEntries(locationsArray.map(l=>[l.id,l]));

export const marioBoardModel = {

  getInitLocationId() : string {
    return initLocationId;
  },

  getLocation( locationId : string ) : Location {
    return locations[locationId];
  },

} as BoardModel;