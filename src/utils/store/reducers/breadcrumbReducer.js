const initState = [
    { text: 'Home', link: '/' }
  ];
  const breadcumbsReducer = (state = initState, action) => {
    switch (action.type) {
      case 'PUSH_BREADCRUMB':
        return [...state, action.payload];
      case 'POP_BREADCRUMB':
        return state.slice(0, state.length - 1);
      default:
        return state
    };
  };

  export default breadcumbsReducer;