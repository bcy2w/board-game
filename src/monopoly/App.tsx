import React, {useState} from 'react';
import {PlayerInfo} from './GameStates';
import Monopoly from './Monopoly';
import './App.css'

const INIT_PLAYERS_INFO : Array<PlayerInfo> = [
  { playerId:'p1', name: 'Alan', colour: 'orange' },
  { playerId:'p2', name: 'Blake', colour: 'blue' },
  { playerId:'p3', name: 'Chris', colour: 'green' },
];

function App() {
  const [playersInfo,setPlayerIds] = useState( INIT_PLAYERS_INFO );
  return (
    <div className="MonopolyApp">
      <Monopoly
          playersInfo={playersInfo}/>
    </div>
  );
}

export default App;