import React, { useState } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';

const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
};

export default (props) => {

    const [values, setValues] = useState(initialValues);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prevState) => ({ ...prevState, [name]: value }));
    }
    const handleSearch = () => {
        props.setData(values);
    }
    const handleReset = () => {
        setValues((prevState) => ({ ...prevState, ...initialValues }));
        props.setData(initialValues);
    }

    return (
        <>
            <Row className="pt-3">
                <Col md={3}>
                    <div className="form-group py-2">
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            className="form-control"
                            value={ values.firstName }
                            onChange={ handleChange }
                            placeholder="First Name"
                        />
                    </div>
                </Col>
                <Col md={3}>
                    <div className="form-group py-2">
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            className="form-control"
                            value={ values.lastName }
                            onChange={ handleChange }
                            placeholder="Last Name"
                        />
                    </div>
                </Col>
                <Col md={3}>
                    <div className="form-group py-2">
                        <input
                            id="email"
                            name="email"
                            type="text"
                            className="form-control"
                            value={ values.email }
                            onChange={ handleChange }
                            placeholder="Email"
                        />
                    </div>
                </Col>
                <Col md={3}>
                    <div className="form-group py-2">
                        <Button variant="primary" type="button" onClick={ handleSearch }>
                            Search
                        </Button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button variant="secondary" type="button" onClick={ handleReset }>
                            Reset
                        </Button>
                    </div>
                </Col>
            </Row>
        </>
    );
};