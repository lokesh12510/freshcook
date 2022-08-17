import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import { FaRegTrashAlt, FaRegFileAlt } from "react-icons/fa";

import * as employeeService from "../services/employeeService";
import * as commonService from "../services/commonService";
import * as departmentService from "../services/departmentService";
import * as commonHelper from '../../../utils/helpers/commonHelper';
import url from '../url';
import * as SweetAlert from "../../ui/SweetAlert";
import FormEditor from "../../ui/FormEditor";
import AutoComplete from "../../ui/AutoComplete";
import DatePicker from "../../ui/DatePicker";
import Select from 'react-select';  //npm i react-select

const initialValues = {
  first_name: "",
  last_name: "",
  gender: "",
  email: "",
  date_of_birth: "",
  profile: "",
  profile_file: "",
  country: "",
  state: "",
  city: "",
  skillSet: [],
  description: "",
  department_id: "",
  departments_data:'',
  from_date:'',
  to_date:'',
};

export const Form = (props) => {
  let navigate = useNavigate();
  
  // Edit
  const params = useParams();
  const id = params.id || '';
  
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState([{ companyname: "", position: "", experience: "" }]);
  const [country, setCountry] = useState([]);
  const [state, setstate] = useState([]);
  const [city, setcity] = useState([]);
  const skillSet = ["Php", "Laravel", "Javscript", "Codeigniter"];
  
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [departmentSelected, setDepartmentSelected] = useState('');

  const [documentFiles, setDocumentFiles] = useState([]);
  const [documentDetails, setDocumentDetails] = useState([]);
  const [departmentsData,setSelectedDepartment] = useState([]);
  const [departmentList,setDepartmentList] = useState([]);
  
  useEffect(() => {
    if(id > 0)
    {
      editEmployee();
    }
    getCountry();
    //fetch department list to display in multiselect
    getDepartmentList();
    // if (values.country != "") {
    //   getState(values.country);
    // }
    // if (values.state != "") {
    //   getCity(values.state);
    // }
    // console.log(props);
  }, []);

  const editEmployee = () => {
    employeeService.Show(id)
    .then((response) => {
      setValues(response.data.EmployeeDetails);
      setSelectedDepartment(response.data.EmployeeDetails.departments_data);

      setEmployeeDetails(response.data.ExperienceDetails);
      setDocumentDetails(response.data.DocumentDetails);
      if(response.data.EmployeeDetails.country !=""){
        getState(response.data.EmployeeDetails.country);
      }
      if(response.data.EmployeeDetails.state !=""){
        getCity(response.data.EmployeeDetails.state);
      }
      if(response.data.DepartmentDetails)
      {
        setDepartmentSelected(p => ([response.data.DepartmentDetails.dep_name]));
      }
    }).catch((e) => {
      console.log(e);
      navigate(url.Employee);
    });
  };

  const getState = async (countryid) => {
    commonService.getStateDetails(countryid)
      .then((response) => {
        setstate(response.data);
      }).catch((e) => {
        console.log(e);
      });
  };

  const getCity = async (stateId) => {
    commonService.getCityDetails(stateId)
      .then((response) => {
        setcity(response.data);
      }).catch((e) => {
        console.log(e);
      });
  };


  const getCountry = async () => {
    commonService.getCountryDetails()
      .then((response) => {
        setCountry(response.data);
      }).catch((e) => {
        console.log(e);
      });
  };

  const getDepartmentList =  async () => {
    departmentService.departmentList()
      .then((response) => {
        //creating object from another object eg:{value:1,label:php}
        let dept_list = response.data.map(v => ({ value: v.id, label: v.dep_name }));
        setDepartmentList(dept_list);
      }).catch((e) => {
        console.log(e);
      });
  };
  const getDepartmentSearch = async(search) => {
    setIsLoading(true);
    departmentService.autoComplete({search})
    .then((response) => {
      setDepartments(response.data);
      setIsLoading(false);
    }).catch((e) => {
      console.log(e);
    });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (e.target.name == "profile_file") {
      let files = e.target.files;
      setValues((p) => ({ ...p, ["profile_file"]: files[0] }));
      setValues((p) => ({ ...p, ["profile"]: URL.createObjectURL(files[0]) }));
    }
    else if (e.target.type == "checkbox" && e.target.name == "skillSet") {
      let newSkillSet = updateSkillSet(e.target.checked, e.target.value, values.skillSet);
      setValues((p) => ({ ...p, ["skillSet"]: newSkillSet }));
    }
    else {
      setValues((p) => ({ ...p, [name]: value }));
    }

    if (e.target.name == "country") {
      if (e.target.value == "") {
        setValues((p) => ({ ...p, ['state']: '', ['city']: '' }));
        setstate([]);
      } else {
        getState(e.target.value);
      }

    }

    if (e.target.name == "state") {
      if (e.target.value == "") {
        setValues((p) => ({ ...p, ['city']: '' }));
        setcity([]);
      } else {
        getCity(e.target.value);
      }
    }
  };

  const updateSkillSet = (checked, value, arr) => {
    if (checked) arr.push(value)
    else {
      let index = arr.findIndex((skill) => skill === value);
      if (index >= 0) arr.splice(index, 1);
    }
    return arr;
  }


  const addMoreInput = (e, index) => {
    const { name, value } = e.target;
    const list = [...employeeDetails];
    list[index][name] = value;
    setEmployeeDetails(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = index => {
    const list = [...employeeDetails];
    if (list.length > 1) {
      list.splice(index, 1);
      setEmployeeDetails(list);
    } else {
      alert("Atleast One row Present");
    }

  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setEmployeeDetails([...employeeDetails, { companyname: "", position: "", experience: "" }]);
  };

  const onSubmit = (e) => {
    
    //convert multiselect value from object to string
    if(typeof values.departments_data!='string')
    {
      values.departments_data = JSON.stringify(values.departments_data);

    }
    e.preventDefault();
    let formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    
    // employeeDetails.forEach(function (element, index) {
    //   formData.append('employeeDetails[' + index + '][companyname]', element.companyname);
    //   formData.append('employeeDetails[' + index + '][position]', element.position);
    //   formData.append('employeeDetails[' + index + '][experience]', element.experience);
    // });
    formData.append('employeeDetails', JSON.stringify(employeeDetails));
    if(documentFiles && documentFiles.length > 0)
    {
      for(let i = 0; i < documentFiles.length; i++)
      {
        formData.append(`document_files`, documentFiles[i]);
      }
    }
    employeeService.Store(formData)
    .then((response) => {
      if(id > 0)
      {
        SweetAlert.successAlert('Employee updated successfully');
      }
      else
      {
        SweetAlert.successAlert('Employee created successfully');
      }
      navigate(url.Employee);
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

  const deleteDocument = (id) => {
    if(window.confirm('Are you sure want to delete?'))
    {
      employeeService.documentDelete(id)
      .then((response) => {
        const newDocumentDetails = documentDetails.filter((item) => item.id !== id);
        setDocumentDetails(newDocumentDetails);
      }).catch((e) => {
        console.log(e);
      });
    }
  }


  return (
    <Container>
      <div className="card">
      <form onSubmit={(e) => onSubmit(e)}>
        {errors.length > 0 ? <p> Validation Errors </p> : ""}
        <div className="form-group py-2">
          <label>First Name</label>
          <input
            type="text"
            className="form-control"
            id="first_name"
            name="first_name"
            value={values.first_name}
            onChange={handleInputChange}
            placeholder="Enter First Name"
          />
          <span className="text-danger">{renderError('first_name')}</span>
        </div>

        <div className="form-group py-2">
          <label>Last Name</label>
          <input
            type="text"
            className="form-control"
            id="last_name"
            name="last_name"
            value={values.last_name}
            onChange={handleInputChange}
            placeholder="Enter Last Name"
          />
          <span className="text-danger">{renderError('last_name')}</span>
        </div>

        <div className="form-group py-2">
          <label style={{ marginRight: "2rem" }}>Gender</label>

          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              id="gender"
              name="gender"
              value="male"
              onChange={handleInputChange}
              checked={values.gender == "male" ? true : false}
            />
            <label className="form-check-label">Male</label>
          </div>

          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              id="gender"
              name="gender"
              value="female"
              onChange={handleInputChange}
              checked={values.gender == "female" ? true : false}
            />
            <label className="form-check-label">FeMale</label>
          </div>

          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              id="gender"
              name="gender"
              value="transgender"
              onChange={handleInputChange}
              checked={values.gender == "transgender" ? true : false}
            />
            <label className="form-check-label">Transgender</label>
          </div>
          <p className="text-danger">{renderError('gender')}</p>
        </div>

        <div className="form-group py-2">
          <label style={{ marginRight: "2rem" }}>Country</label>

          <select name="country" className="form-control country" value={values.country} onChange={handleInputChange}>
            <option value="">select country</option>
            {country.map((item, index) => (<option value={item.id} > {item.name}</option>))}
          </select>
          <p className="text-danger">{renderError('country')}</p>
        </div>

        {values.country ? (
          <div className="form-group py-2">
            <label style={{ marginRight: "2rem" }}>State</label>
            <select name="state" className="form-control state" value={values.state} onChange={handleInputChange}>
              <option value="">select state</option>
              {state.map((item, index) => (<option value={item.id} > {item.name}</option>))}
            </select>
            <p className="text-danger">{renderError('state')}</p>
          </div>) : ""}
        {values.country && values.state ? (
          <div className="form-group py-2">
            <label style={{ marginRight: "2rem" }}>City</label>
            <select name="city" className="form-control city" value={values.city} onChange={handleInputChange}>
              <option value="">select City</option>
              {city.map((item, index) => (<option value={item.id} > {item.name}</option>))}
            </select>
            <p className="text-danger">{renderError('city')}</p>
          </div>) : ""}

        <div className="form-group py-2">
          <label style={{ marginRight: "2rem" }}>skillSet</label>
          {skillSet.map((item, index) => (<div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              name="skillSet"
              value={item}
              checked={values.skillSet.findIndex((skill) => skill == item) >= 0}
              onChange={handleInputChange}
            />
            <label className="form-check-label">{item}</label>
          </div>))}
          <p className="text-danger">{renderError('skills')}</p>
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
          <label>Date Of Birth</label>
          <DatePicker 
            className="form-control"
            id="date_of_birth"
            name="date_of_birth"
            placeholderText="Date Of Birth"
            selected={ values.date_of_birth && new Date(values.date_of_birth) }
            onChange={(date) => {
              setValues((p) => ({ ...p, ['date_of_birth']: date.toISOString() }));
            }}
            maxDate={ commonHelper.getDateByYear(-18) }
            minDate={ commonHelper.getDateByYear(-100) }
            dateFormat="dd/MM/yyyy"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
          <span className="text-danger">{renderError('date_of_birth')}</span>
        </div>
        <div className="experiemce-details">
        <div className="form-group py-2 col-md-3">
        <label>From Date</label>

        <DatePicker
         className="form-control"
         id="from_date"
         name="from_date"
         placeholderText="From Date"
      selected={values.from_date && new Date(values.from_date)}
      onChange={(date) => {
        setValues((p) => ({ ...p, ['from_date']: (date)?date.toISOString():'' }));
      }}
      minDate={new Date()}
      showTimeSelect
      timeFormat="p"
      timeIntervals={15}
      dateFormat="dd/MM/yyyy h:mm aa"
      />
          <span className="text-danger">{renderError('from_date')}</span>
        </div>
        <div className="form-group py-2 col-md-3">
        <label>To Date</label>

        <DatePicker
         className="form-control"
         id="to_date"
         name="to_date"
         placeholderText="To Date"
      selected={values.to_date && new Date(values.to_date)}
      onChange={(date) => {
        setValues((p) => ({ ...p, ['to_date']: (date)?date.toISOString():'' }));
      }}
      showTimeSelect
      timeFormat="p"
      timeIntervals={15}
      dateFormat="dd/MM/yyyy h:mm aa"
      />
          <span className="text-danger">{renderError('to_date')}</span>
        </div>
        </div>
        <div className="form-group py-2">
          <label>Department</label>
          <AutoComplete 
            isLoading={ isLoading }
            id="department_id"
            labelKey="dep_name"
            options={ departments }
            selected={ departmentSelected }
            placeholder={ departmentSelected }
            onSearch={search => {
              getDepartmentSearch(search);
            }}
            onChange={selected => {
              setValues(p => ({ ...p, ['department_id']: selected[0].id }));
            }}
          />
          <span className="text-danger">{renderError('department_id')}</span>
        </div>

        <div className="form-group py-2">
          <label>Department Details</label>
          <Select
          isMulti
          placeholder="Select Option"
          value={departmentsData} // set selected value
          options={departmentList} // set list of the data
          onChange={(e)=>{setSelectedDepartment(e); setValues({...values,['departments_data']:e})}} // assign onChange function
        />
          {/* <AutoComplete 
            multiple={true}
            isLoading={ isLoading }
            id=""
            labelKey="dep_name"
            options={ departments }
            selected={ departmentsData }
            placeholder={ departmentsData }
            onSearch={search => {
              getDepartmentSearch(search);
            }}
                onChange={selected => {
                  setSelectedDepartment(selected);
            }
          }
          /> */}
          <span className="text-danger">{renderError('department_id')}</span>
        </div>

        <div className="form-group py-2">
          <label>Description</label>
          <FormEditor 
            editorId="description" 
            editorData={ values.description }
            onEditorChange={(data) => {
              setValues(p => ({ ...p, ['description']: data }));
            }}
          />
        </div>
        
        <div className="form-group py-2">
          <label>Profile</label>
          <input
            type="file"
            className="form-control"
            name="profile_file"
            accept="image/*"
            onChange={handleInputChange}
          />
          <span className="text-danger">{renderError('profile_file')}</span>
          {values.profile && (
          <div className="form-group col-md-6 py-2">
            <img src={ values.profile } className="img-thumbnail" style={{maxHeight:"100px"}} alt="image" />
          </div>
          )}
        </div>

        <hr />
        
        <h6>Experience Details:</h6>
        <div className="experiemce-details">
          {employeeDetails.map((input, index) => {
            return (
              <div className="row" key={index}>
                <div className="form-group py-2 col-md-3">
                  <label>Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="companyname"
                    value={input.companyname}
                    onChange={e => addMoreInput(e, index)}
                    placeholder="Company Name"
                  />
                  <p className="text-danger">{renderError('employeeDetails.' + index + '.companyname')}</p>
                </div>
                <div className="form-group py-2 col-md-3">
                  <label>Position</label>
                  <input
                    type="text"
                    className="form-control"
                    name="position"
                    value={input.position}
                    onChange={e => addMoreInput(e, index)}
                    placeholder="Enter Position"
                  />
                  <p className="text-danger">{renderError('employeeDetails.' + index + '.position')}</p>
                </div>

                <div className="form-group py-2 col-md-3">
                  <label>Experience</label>
                  <input
                    type="number"
                    className="form-control"
                    name="experience"
                    value={input.experience}
                    onChange={e => addMoreInput(e, index)}
                    placeholder="Enter Experience"
                  />
                  <p className="text-danger">{renderError('employeeDetails.' + index + '.experience')}</p>

                </div>
                <div className="form-group py-2 col-md-3">

                  <button type="button" className="btn btn-danger remove-row mb50" onClick={() => handleRemoveClick(index)}>-</button>
                  <button type="button" className="btn btn-success add-row mb50" onClick={handleAddClick}>+</button>


                </div>

              </div>
            );
          })}
        </div>

        <hr />

        <h6>Documents</h6>
        <div className="form-group py-2">
          <input
            type="file"
            className="form-control"
            name="documents"
            onChange={(e) => {
              let files = e.target.files;
              //setDocumentFiles(files);
              Array.from(files).map((file, index) => {
                setDocumentFiles((p) => ([ ...p, file ]));
              });
            }}
            multiple={ true }
          />
          <span className="text-danger">{renderError('document_files')}</span>

          {documentFiles && documentFiles.length > 0 && (
          <div className="row pt-3">
            <p><b>Selected Files:</b></p>
            {documentFiles.map((file, index) => {
              return (
                <div className="col-sm-6 py-1" key={ index }>
                  <a href={ URL.createObjectURL(file) } target="_blank" style={{textDecoration:"none"}}>
                    <FaRegFileAlt variant="primary" /> { file.name }
                  </a>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <FaRegTrashAlt variant="primary" className="deleteicon" onClick={() => {
                    const newDocumentFiles = [...documentFiles];
                    newDocumentFiles.splice(index, 1);
                    setDocumentFiles(newDocumentFiles);
                  }} />
                </div>
              );
            })}
          </div>
          )}

          {documentDetails && documentDetails.length > 0 && (
          <div className="row pt-3">
            <p><b>Uploaded Files:</b></p>
            {documentDetails.map((item, index) => {
              return (
                <div className="col-sm-6 py-1" key={ index }>
                  <a href={ item.upload_path } target="_blank" style={{textDecoration:"none"}}>
                    <FaRegFileAlt variant="primary" /> { item.upload_path.replace(/^.*[\\\/]/, '') }
                  </a>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <FaRegTrashAlt variant="primary" className="deleteicon" onClick={() => deleteDocument(item.id)} />
                </div>
              );
            })}
          </div>
          )}

        </div>

        
        <button type="submit" className="btn btn-primary mt-2">
          Submit
        </button>
      </form>
    </div>
    </Container>
  );
};
