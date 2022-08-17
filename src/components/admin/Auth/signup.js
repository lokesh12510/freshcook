import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import * as authService from "../services/authService";
import ReCaptcha from '../../ui/ReCaptcha';
import url from '../url';


const initialValues = {
  name: "",
  email: "",
  password: "",
  recaptcha: "",
};

export const Signup = () => {
  let navigate = useNavigate();
  
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState("");

  const recaptchaRef = React.createRef();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if(recaptchaRef.current)
    {
      const recaptchaValue = recaptchaRef.current.getValue();
      if(recaptchaValue)
      {
        recaptchaRef.current.reset();
        values.recaptcha = recaptchaValue;
      }
    }
    authService.Signup(values)
    .then((response) => {
      navigate(url.Login);
    }).catch((e) => {
      let error=e.response.data.error[0];
      setErrors(error);
    });
  };

  const hasErrorFor = (fieldName) => {
    return !!errors[fieldName];
  };

  const renderError=(fieldName)=>{
    let status=hasErrorFor(fieldName);
    if(status){
      return errors[fieldName][0];
    }
  }
  
  
  return (
    <div className="container col-md-6 border" style={{marginTop:50,padding:45,background:"ghostwhite",borderRadius:25}}>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-group py-2">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={values.name}
            onChange={handleInputChange}
            placeholder="Enter Name"
          />
          <span className="text-danger">{renderError('name')}</span>
        </div>

        <div className="form-group py-2">
          <label>Email</label>
          <input
            type="text"
            className="form-control"
            id="email"
            name="email"
            value={values.email}
            onChange={handleInputChange}
            placeholder="Enter Email"
          />
          <span className="text-danger">{renderError('email')}</span>
        </div>
        
        <div className="form-group py-2">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={values.password}
            onChange={handleInputChange}
            placeholder="Enter Password Here"
          />
          <span className="text-danger">{renderError('password')}</span>
        </div>
        
        <div className="form-group py-2">
          <label>ReCaptcha</label>
          <ReCaptcha 
            size="normal"
            ref={ recaptchaRef }
            onChange={(value) => {
            }}
          />
          <span className="text-danger">{renderError('recaptcha')}</span>
        </div>

        <div className="form-group py-2">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};