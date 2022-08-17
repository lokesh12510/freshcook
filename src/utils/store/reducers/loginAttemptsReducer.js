const initState = 1;

const loginAttempts = (state = initState, action) => {
    switch(action.type)
    {
        case "UPDATE_LOGIN_ATTEMPTS":
            return (state + 1);
        case "RESET_LOGIN_ATTEMPTS":
            return (state = initState);
        default:
            return state;
    }
};

export default loginAttempts;