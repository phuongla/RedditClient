import { setToken, getToken, clearToken, tokenHasExpired } from '../api/Storage'

/**
 * This works because of our redux-thunk middleware in ./store/configureStore
 *
 * ...action creators that return a function instead of an action.
 * The thunk can be used to delay the dispatch of an action,
 * or to dispatch only if a certain condition is met.
 * The inner function receives the functions dispatch and getState as parameters.
 */
const startAuthentication = () => async (dispatch) => {
  // you'll want to use an async function for this call to eventually
  // be able to "await" the getToken call from AsyncStorage
  hasExpired = await tokenHasExpired();
  if(hasExpired) {
    await clearToken();
    dispatch({ type: types.AUTH_PENDING });
  } else {
      token = await getToken();
      dispatch(authSuccess(token));
  }
}

const authSuccess = (token) => {
  setToken(token);
  return { type: types.AUTH_SUCCESS, token: token}
}

const authFailure = (error) => {
  return { type: types.AUTH_FAILURE, error: error}
}

const types = {
  AUTH_PENDING: 'AUTH_PENDING',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
}

export const actionCreators = {
  startAuthentication,
  authSuccess,
  authFailure,
}

const initialState = {
  isAuthenticating: false,
  accessToken: null,
}

export const reducer = (state = initialState, action) => {
  const {type, payload} = action

  switch(type) {
    // update state here
    case types.AUTH_PENDING:
      return {
        ...state,
        isAuthenticating: true,
        accessToken: null,
        error: null,
      }
    case types.AUTH_SUCCESS:
      return {
        ...state,
        isAuthenticating: false,
        accessToken: action.token,
        error: null,
      }
    case types.AUTH_FAILURE:
      return {
        ...state,
        isAuthenticating: false,
        accessToken: null,
        error: action.error,
      }
    default: {
      return state
    }
  }
}
