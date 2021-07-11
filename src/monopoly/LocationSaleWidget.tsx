import React from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/form';
import {LocationSaleState,GameStates,PlayerState} from './GameStates';
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
        <Form.Label>Location</Form.Label>
        <Form.Control type="text" placeholder={location.name} readOnly/>
      </Form.Group>
      <Form.Group>
        <Form.Label>Cost</Form.Label>
        <Form.Control type="text" placeholder={''+props.locationSaleState.askingPrice} readOnly/>
      </Form.Group>
      <Button className="the-button" variant="primary"
          onClick={()=>props.onBuy?.(props.locationSaleState)}>Buy</Button>
      &nbsp;
      <Button className="the-button" variant="primary"
          onClick={()=>props.onDecline?.(props.locationSaleState)}>Decline</Button>
    </Form>
  );
}

export default LocationSaleWidget;
