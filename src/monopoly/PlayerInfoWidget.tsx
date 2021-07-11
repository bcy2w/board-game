import React from 'react';
import Form from 'react-bootstrap/form';
import {PlayerState} from './GameStates';
import BoardModel from './BoardModel';

interface Props {
  playerNumber : number;
  playerState : PlayerState;
  boardModel : BoardModel;
}

function PlayerInfoWidget( props : Props ) {
  return (
    <Form>
      <Form.Group>
        <Form.Label>Player Number</Form.Label>
        <Form.Control type="text" placeholder={''+props.playerNumber} readOnly/>
      </Form.Group>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder={''+props.playerState.playerInfo.name} readOnly/>
      </Form.Group>
      <Form.Group>
        <Form.Label>Location</Form.Label>
        <Form.Control type="text" placeholder={
            props.boardModel.getLocationName(props.playerState.locationId)
          } readOnly/>
      </Form.Group>
      <Form.Group>
        <Form.Label>Cash</Form.Label>
        <Form.Control type="text" placeholder={''+props.playerState.cash} readOnly/>
      </Form.Group>
    </Form>
  );
}

export default PlayerInfoWidget;
