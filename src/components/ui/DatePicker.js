import React from 'react';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default (props) => {
    return (
        <>
            <DatePicker 
                { ...props }
                //selected={ date }
                //onChange={ (value) => changeDate(value) }
                //onSelect={ (value) => changeDate(value) }
                //maxDate={ new Date() }
                //minDate={ new Date() }
                //dayClassName={(date) => "bg-danger" }
                //showTimeSelect
                //dateFormat="yyyy/MM/dd"
                //showMonthDropdown
                //showYearDropdown
                //inline
                //withPortal
            />
        </>
    );
}