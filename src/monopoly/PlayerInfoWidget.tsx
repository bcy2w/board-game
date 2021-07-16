import React from 'react';
import Form from 'react-bootstrap/form';
import Col from 'react-bootstrap/col';
import {PlayerState} from './GameStates';
import BoardModel from './BoardModel';
import './PlayerInfoWidget.css';

interface Props {
  playerState : PlayerState;
  boardModel : BoardModel;
}

function PlayerInfoWidget( props : Props ) {
  return (
    <Form>
      <Form.Group className="text-right">
        <Form.Label column="sm">Player</Form.Label>
        <Form.Control readOnly type="text" size="sm"
            placeholder={''+props.playerState.playerInfo.name}/>
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label column="sm">Location</Form.Label>
        <Col>
        <Form.Control readOnly type="text" size="sm" placeholder={
            props.boardModel.getLocationName(props.playerState.locationId)
          } />
        </Col>
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label column="sm">Cash</Form.Label>
        <Col>
        <Form.Control readOnly type="text" size="sm"
            placeholder={''+props.playerState.cash}/>
        </Col>
      </Form.Group>
    </Form>
  );
}

export default PlayerInfoWidget;
