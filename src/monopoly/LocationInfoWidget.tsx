import React from 'react';
import Form from 'react-bootstrap/form';
import Col from 'react-bootstrap/col';
import {Location} from './BoardModel';

interface Props {
  location : Location;

}

function LocationInfoWidget( props : Props ) {
  return (
    <Form>
      <Form.Group className="text-right">
        <Form.Label column="sm">Location</Form.Label>
        <Form.Control readOnly type="text" size="sm"
            placeholder={''+props.location.name}/>
      </Form.Group>
      <Form.Group>
        <Form.Label column="sm">Cost</Form.Label>
        <Form.Control readOnly type="text" size="sm"
            placeholder={''+(props.location.cost||'n/a')}
          />
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label column="sm">Rent</Form.Label>
        <Col>
        <Form.Control readOnly type="text" size="sm"
            placeholder={''+(props.location.rent||'n/a')}/>
        </Col>
      </Form.Group>
    </Form>
  );
}

export default LocationInfoWidget;
