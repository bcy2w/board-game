import React, {useState} from 'react';
import Button from 'react-bootstrap/Button'

type Props = {
  numDice : number;
  disabled : boolean;
  onRoll? : (rolls:Array<number>)=>void;
}

const DEFAULT_PROPS : Props = {
  numDice : 2,
  disabled : false
}

const rollDie = () : number => Math.floor( Math.random() * 6 ) + 1;


function Dice( props : Props ) {
  const [disabled,setDisabled] = useState( true );
  const [dice,setDice] = useState( Array(props.numDice).fill(0) );

  if ( disabled !== props.disabled ) {
    setDisabled( props.disabled );
  }
  if ( disabled && !props.disabled ) {
    setDice( Array(props.numDice).fill(0) );
  }

  const handleRollDice = () => {

    const rolls = dice.map( rollDie );

    setDice( rolls );

    props.onRoll?.(rolls)
  }

  return (
    <div>
      { dice.map( (die,index) => (
        <div key={index}>
          <span>{die||'?'}</span>
        </div>
        ))
      }
      <Button className="the-button" variant="primary" disabled={props.disabled}
          onClick={handleRollDice}>Roll Dice</Button>
    </div>
  );
}
Dice.defaultProps = DEFAULT_PROPS;

export default Dice;
