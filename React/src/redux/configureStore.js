import { createStore, applyMiddleware, compose } from 'redux';
import authReducer from './authReducer';
import SecureLS from 'secure-ls';
import thunk from 'redux-thunk';
import { setAuthorizationHeader } from '../api/apiCalls';

const secureLs = new SecureLS();

const getStateFromStorage = () => {

    const exampleAuth = secureLs.get('example-auth');

    let stateInLocalStorage = {
        isLoggedIn: false,
        userID: undefined,
        username: undefined,
        image: undefined,
        password: undefined
    }

    if (exampleAuth) {
        return exampleAuth;
    }

    return stateInLocalStorage;

}

const updateStateInStorage = (newState) => {
    secureLs.set('example-auth', newState);
}

const configureStore = () => {
    const initialState = getStateFromStorage();
    setAuthorizationHeader(initialState);
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(authReducer, initialState, composeEnhancers(applyMiddleware(thunk)));

    store.subscribe(() => {
        updateStateInStorage(store.getState());
        setAuthorizationHeader(store.getState());
    })

    return store;
}

export default configureStore;