import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { rootReducer } from './reducers';

const NODE_ENV = 'development';
const composeEnhancers = (NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null) || compose;

// store
export const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk)
));