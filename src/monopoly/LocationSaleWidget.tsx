import React from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/form';
import {LocationSaleState,PlayerState} from './GameStates';
import BoardModel from './BoardModel';

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
    <Form>
      <Form.Group>
        <Form.Label column="sm">Location</Form.Label>
        <Form.Control readOnly size="sm" type="text" placeholder={location.name}/>
      </Form.Group>
      <Form.Group>
        <Form.Label column="sm">Cost</Form.Label>
        <Form.Control readOnly size="sm" type="text" placeholder={''+props.locationSaleState.askingPrice}/>
      </Form.Group>
      <hr/>
      <Form.Group>
      <Button variant="primary"
          onClick={()=>props.onBuy?.(props.locationSaleState)}>Buy</Button>
      &nbsp;
      <Button variant="primary"
          onClick={()=>props.onDecline?.(props.locationSaleState)}>Decline</Button>
      </Form.Group>
    </Form>
  );
}

export default LocationSaleWidget;
