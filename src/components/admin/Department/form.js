import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';

import * as departmentService from "../services/departmentService";
import * as SweetAlert from "../../ui/SweetAlert";
import CheckAccess from '../Auth/checkAccess';

const initialValues = {
  dep_name: "",
};

export default forwardRef((props, ref) => {
    const { callback } = props;

    const [id, setId] = useState('');
    const [show, setShow] = useState(false);

    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState([]);

    const handleShow = () => {
        setShow(true);
    }
    const handleClose = () => {
        setShow(false);
    }
    
    useImperativeHandle(ref, () => ({
        setId,
        handleShow,
        handleClose,
    }));

    useEffect(() => {
      setValues((p) => ({ ...p, ...initialValues }));
      setErrors([]);
      if(show && id > 0)
      {
        editDepartment();
      }
    }, [show]);
    
    const editDepartment = () => {
        departmentService.Show(id)
        .then((response) => {
          setValues(response.data);
        }).catch((e) => {
          console.log(e);
        });
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setValues((p) => ({ ...p, [name]: value }));
    };
    
    const onSubmit = (e) => {
      e.preventDefault();
      const data = values;
      if(id > 0)
      {
        data.dep_id = id;
      }
      departmentService.Store(data)
      .then((response) => {
        if(id > 0)
        {
          SweetAlert.successAlert('Department updated successfully');
        }
        else
        {
          SweetAlert.successAlert('Department created successfully');
        }
        handleClose();
        callback();
      }).catch((e) => {
        let errors = e.response.data.error[0];
        setErrors(errors);
      });
    };

    // Form Errors
    const hasErrorFor = (fieldName) => {
      return !!errors[fieldName];
    };
    const renderError = (fieldName) => {
      let status = hasErrorFor(fieldName);
      if(status)
      {
        return errors[fieldName][0];
      }
    }

    
    return (
      <>
        <Modal show={ show } onHide={ handleClose }>
          <Modal.Header closeButton>
            <Modal.Title>{ id ? 'Edit Departrment' : 'Add Departrment' }</Modal.Title>
          </Modal.Header>
          <form onSubmit={(e) => onSubmit(e)}>
            <Modal.Body>
              {errors.length > 0 ? <p> Validation Errors </p> : ""}
              <div className="form-group py-2">
                <label>Department</label>
                <input
                  type="text"
                  className="form-control"
                  name="dep_name"
                  value={values.dep_name}
                  placeholder="Enter department"
                  onChange={handleInputChange}
                />
                <span className="text-danger">{renderError('dep_name')}</span>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" type="button" onClick={ handleClose }>
                Close
              </Button>
              <Button variant="primary" type="submit">
                { id ? 'Update' : 'Submit' }
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </>
    );
});