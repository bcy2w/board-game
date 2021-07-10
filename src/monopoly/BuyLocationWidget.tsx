import React from 'react';
import Form from 'react-bootstrap/form';
import {GameStates,PlayerState} from './GameStates';
import BoardModel from './BoardModel';

interface Props {
  locationId : string;
  playerState : PlayerState;
  gameStates : GameStates;
  boardModel : BoardModel;
}

function BuyLocationWidget( props : Props ) {
  const locationId = props.playerState.locationId;
  const location = props.boardModel.getLocation( locationId );

  const ownership = props.gameStates.ownershipAssignments[ locationId ];

  if ( ownership ) {
    <Form>
      <Form.Group>
        <Form.Label>Location</Form.Label>
        <Form.Control type="text" placeholder={location.name} readOnly/>
      </Form.Group>
      <Form.Group>
        <Form.Label>Owner</Form.Label>
        <Form.Control type="text" placeholder={''+props.playerState.playerInfo.name} readOnly/>
      </Form.Group>
      <Form.Group>
        <Form.Label>Location</Form.Label>
        <Form.Control type="text" placeholder={
            props.boardModel.getLocationName(props.playerState.locationId)
          } readOnly/>
      </Form.Group>
    </Form>
  }
  return (
    <Form>
      <Form.Group>
        <Form.Label>Location</Form.Label>
        <Form.Control type="text" placeholder={
          props.boardModel.getLocationName(props.playerState.locationId)} readOnly/>
      </Form.Group>
      <Form.Group>
        <Form.Label>Location</Form.Label>
        <Form.Control type="text" placeholder={
            props.boardModel.getLocationName(props.playerState.locationId)
          } readOnly/>
      </Form.Group>
    </Form>
  );
}

export default BuyLocationWidget;
