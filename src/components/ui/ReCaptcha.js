import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { constants } from '../../utils/constants';

export default React.forwardRef((props, ref) => {
    return (
        <>
            <ReCAPTCHA 
                { ...props }
                ref={ ref }
                sitekey={ constants.googleRecaptchaSite }
            />
        </>
    );
});