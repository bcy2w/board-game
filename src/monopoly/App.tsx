import React, {useState} from 'react';
import {PlayerInfo} from './GameStates';
import Monopoly from './Monopoly';

const INIT_PLAYERS_INFO : Array<PlayerInfo> = [
  { playerId:'p1', name: 'Alan' },
  { playerId:'p2', name: 'Blake' },
  { playerId:'p3', name: 'Chris' },
];

function App() {
  const [playersInfo,setPlayerIds] = useState( INIT_PLAYERS_INFO );
  return (
    <div className="App">
      <header className="App-header">
        <Monopoly
            playersInfo={playersInfo}/>
      </header>
    </div>
  );
}

export default App;