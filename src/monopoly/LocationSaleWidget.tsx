import React from 'react';
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/card';
import {LocationSaleState,PlayerState} from './GameStates';
import {BoardModel} from './BoardModel';

interface Props {
  locationSaleState : LocationSaleState;
  playerState : PlayerState;
  boardModel : BoardModel;

  onBuy? : (a:LocationSaleState)=>void;
  onDecline? : (a:LocationSaleState)=>void;
}

function LocationSaleWidget( props : Props ) {
  const locationId = props.locationSaleState.locationId;
  const location = props.boardModel.getLocation( locationId );

  if ( !props.locationSaleState ) {
    return <span>Nothing for Sale</span>
  }
  return (
    <Card>
      <Card.Title>Location Sale</Card.Title>
      <Card.Text>
        Will you buy {location.name} for {location.cost} ?
      </Card.Text>
      <Button variant="primary"
          onClick={()=>props.onBuy?.(props.locationSaleState)}>Buy</Button>
      <Button variant="primary"
          onClick={()=>props.onDecline?.(props.locationSaleState)}>Decline</Button>
    </Card>
  );
}

export default LocationSaleWidget;
