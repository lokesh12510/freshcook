import React from "react";
import { Row, Col, Button, Form, FormGroup } from 'react-bootstrap';
import { FaTimes } from "react-icons/fa";

export default ({ filter, onFilter, onClear }) => (
  <>
    <Row className="mb-3">
      <Col md={12}>
        <Form className="d-flex">
          <FormGroup>
            <Form.Control 
              type="text"
              id="filter"
              name="filter"
              className="form-control"
              placeholder="Filter"
              value={ filter }
              onChange={ onFilter }
            />
          </FormGroup>
          <FormGroup>
            <Button variant="secondary" type="button" onClick={ onClear }>
              <FaTimes />
            </Button>
          </FormGroup>
        </Form>
      </Col>
    </Row>
  </>
);